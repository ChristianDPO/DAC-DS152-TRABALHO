package ufpr.dac.bantads.cliente.rabbitmq;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.transaction.annotation.Transactional;

import org.json.JSONObject;

import java.util.Optional;

import org.json.JSONException;
import org.modelmapper.ModelMapper;

import ufpr.dac.bantads.cliente.model.Cliente;
import ufpr.dac.bantads.cliente.model.ClienteDTO;
import ufpr.dac.bantads.cliente.model.Endereco;
import ufpr.dac.bantads.cliente.model.EnderecoDTO;
import ufpr.dac.bantads.cliente.repository.ClienteRepository;
import ufpr.dac.bantads.cliente.repository.EnderecoRepository;

@Component
public class ClienteQueueListener {

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private ClienteRepository repo;

	@Autowired
	private EnderecoRepository repoEnder;

	public String empacotaMensagem(String message, String payload){

		JSONObject newMessage = new JSONObject();
		newMessage.put("message", message);
		newMessage.put("payload", payload);
		return newMessage.toString();

	}

	public ClienteDTO cadastrarCliente(ClienteDTO c){
		
		EnderecoDTO enderecoDTO = c.getEndereco();
			
		//Evita sobrescrita se id estiver setado
		enderecoDTO.setId(null);
		c.setId(null);

		Endereco endereco = repoEnder.save(mapper.map(enderecoDTO, Endereco.class));
		Cliente cliente = mapper.map(c, Cliente.class);
		
		cliente.setEndereco(endereco);
		cliente.setAprovado(false);
		
		try{
			
			Cliente inserted = repo.save(cliente);
			return mapper.map(inserted, ClienteDTO.class);

		}catch(DataIntegrityViolationException e){
			//caso problema ao inserir o endereco, 
			repoEnder.deleteById(endereco.getId());
			return null;
		}

	}


	public boolean deletarCliente(ClienteDTO c){
	
		Long id = c.getId();			
		Optional<Cliente> result = repo.findById(id);

		if(result.isPresent()){
			repo.deleteById(id);
			return true;
		}
		else{
			return false;
		}

	}

	public boolean atualizarAprovadoCliente(ClienteDTO c, boolean valor){

		return repo.findById(c.getId()).map(cliente -> {
			
			cliente.setAprovado(valor);
			repo.save(cliente);
			return true;
		
		}).orElse(false);

	}


	@RabbitListener(queues = "clientes.v1.clientes")
	public String consumirMensagem(String json){		
		try {
			
			JSONObject messageObj = new JSONObject(json);
			String message = messageObj.get("message").toString();
			String payload = messageObj.get("payload").toString();
	
			System.out.println(message);
			switch(message) {
				case "CadastrarCliente":
		
					ClienteDTO cliente = objectMapper.readValue(payload, ClienteDTO.class);			  
					
					try{

						cliente = cadastrarCliente(cliente);

						if(cliente == null){
							return empacotaMensagem("ConflitoCadastrarCliente", "");
						}

						return empacotaMensagem("ClienteCadastrado", objectMapper.writeValueAsString(cliente));

					}
					catch(Exception e){
						return empacotaMensagem("FalhaCadastrarCliente", "");
					}

				case "AprovarCliente":
		
					ClienteDTO clienteAp = objectMapper.readValue(payload, ClienteDTO.class);			  
					
					try{

						if(atualizarAprovadoCliente(clienteAp, true)){
							return empacotaMensagem("ClienteAprovado", "");
						}

						return empacotaMensagem("FalhaAprovarCliente", "");

					}
					catch(Exception e){
						return empacotaMensagem("MensagemInvalida", "");
					}

				case "ReverterAprovarCliente":
		
					ClienteDTO clienteRep = objectMapper.readValue(payload, ClienteDTO.class);			  
					
					try{

						if(atualizarAprovadoCliente(clienteRep, false)){
							return empacotaMensagem("ClienteAprovado", "");
						}

						return empacotaMensagem("FalhaReverterAprovarCliente", "");

					}
					catch(Exception e){
						return empacotaMensagem("MensagemInvalida", "");
					}

				case "DeletarCliente":

					ClienteDTO clienteDel = objectMapper.readValue(payload, ClienteDTO.class);

					if(deletarCliente(clienteDel)){
						return empacotaMensagem("ClienteDeletado", "");
					}

					return empacotaMensagem("FalhaDeletarCliente", "");

				default:
				  return empacotaMensagem("MensagemInvalida", "");
			}
			


		} catch (JsonMappingException e) {
			return empacotaMensagem("MensagemInvalida", "");
		} catch(JsonProcessingException e){
			return empacotaMensagem("MensagemInvalida", "");
		}catch(JSONException e){
			return empacotaMensagem("MensagemInvalida", "");
		}

	
	}
	
}
