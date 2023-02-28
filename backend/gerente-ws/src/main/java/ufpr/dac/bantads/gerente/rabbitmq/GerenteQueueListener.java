package ufpr.dac.bantads.gerente.rabbitmq;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.transaction.annotation.Transactional;


import org.json.JSONObject;
import org.json.JSONException;
import org.modelmapper.ModelMapper;

import ufpr.dac.bantads.gerente.model.Gerente;
import ufpr.dac.bantads.gerente.model.GerenteDTO;
import ufpr.dac.bantads.gerente.repository.GerenteRepository;

@Component
public class GerenteQueueListener {

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private GerenteRepository repo;


	public String empacotaMensagem(String message, String payload){

		JSONObject newMessage = new JSONObject();
		newMessage.put("message", message);
		newMessage.put("payload", payload);
		return newMessage.toString();

	}

	public GerenteDTO cadastrarGerente(GerenteDTO g){

		g.setId(null);
		Gerente gerente = mapper.map(g, Gerente.class);
		Gerente inserted = repo.save(gerente);
		return mapper.map(inserted, GerenteDTO.class);

	}

	public boolean deletarGerente(GerenteDTO g){
	
		Long id = g.getId();	
		System.out.println(id);		
		Optional<Gerente> result = repo.findById(id);

		if(result.isPresent()){
			repo.deleteById(id);
			return true;
		}
		else{
			return false;
		}

	}

	public Long atualizaGerenteDesignado(){
	
		Gerente gerente = repo.findByMinNumClientes();
		
		if(gerente == null){
			return null;
		}

		Long id = gerente.getId();
		gerente.setNumClientes(gerente.getNumClientes() + 1);
		repo.save(gerente);
		
		return id;


	}

	public boolean reverterAtualizaGerenteDesignado(Long id){
	
		return repo.findById(id).map(gerente -> {
			
			gerente.setNumClientes(gerente.getNumClientes() - 1);

			Gerente updated = repo.save(gerente);
			return true;
		
		}).orElse(false);
		
	}


	@RabbitListener(queues = "gerentes.v1.gerentes")
	public String consumirMensagem(String json){
			
		try {
			
			JSONObject messageObj = new JSONObject(json);
			String message = messageObj.get("message").toString();
			String payload = messageObj.get("payload").toString();
	
			System.out.println(message);		
			switch(message) {
				case "CadastrarGerente":
		
					GerenteDTO gerente = objectMapper.readValue(payload, GerenteDTO.class);			  
				  	
					try{
						gerente = cadastrarGerente(gerente);
					}
					catch(DataIntegrityViolationException e){
						return empacotaMensagem("ConflitoCadastrarGerente", "");
					} 
					catch(Exception e){
						return empacotaMensagem("FalhaCadastrarGerente", "");
					}
				
				  	return empacotaMensagem("GerenteCadastrado", objectMapper.writeValueAsString(gerente));

				case "ValidarGerente":
					
					try{

						Long idGerente = atualizaGerenteDesignado();
						
						if(idGerente == null){
							return empacotaMensagem("FalhaValidarGerente", "");
						}

						JSONObject payloadObj = new JSONObject(payload);
						payloadObj.put("idGerente", idGerente);
	  
						return empacotaMensagem("GerenteValidado", payloadObj.toString());

					}catch(Exception e){
						return empacotaMensagem("FalhaValidarGerente", "");
					}

				case "ReverterValidarGerente":
					
					try{

						JSONObject payloadObj = new JSONObject(payload);
						Long idGerente = Long.parseLong(payloadObj.get("idGerente").toString());

						// System.out.println(idGerente);
						
						if(reverterAtualizaGerenteDesignado(idGerente)){
							return empacotaMensagem("ValidarGerenteRevertido", "");
						}
						else{
							return empacotaMensagem("FalhaReverterValidarGerente", "");
						}

					}catch(Exception e){
						return empacotaMensagem("FalhaReverterValidarGerente", "");
					}
					
				case "DeletarGerente":

					try{

						GerenteDTO gerenteDel = objectMapper.readValue(payload, GerenteDTO.class);			  
						if(deletarGerente(gerenteDel)){
							return empacotaMensagem("GerenteDeletado", "");
						}

						return empacotaMensagem("FalhaDeletarGerente", "");
					
					}catch(Exception e){
						return empacotaMensagem("FalhaDeletarGerente", "");
					}

				default:
				  return empacotaMensagem("MensagemInvalida", "");
			}

		} catch (JsonMappingException e) {
			return empacotaMensagem("MensagemInvalida", "");
		} catch(JsonProcessingException e){
			return empacotaMensagem("MensagemInvalida", "");
		} catch(JSONException e){
			return empacotaMensagem("MensagemInvalida", "");
		}
	
	}
	
}
