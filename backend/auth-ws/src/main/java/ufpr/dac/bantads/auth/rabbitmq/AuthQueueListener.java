package ufpr.dac.bantads.auth.rabbitmq;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.dao.DataIntegrityViolationException;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;

import ufpr.dac.bantads.auth.model.Auth;
import ufpr.dac.bantads.auth.model.AuthDTO;
import ufpr.dac.bantads.auth.repository.AuthRepository;
import org.apache.commons.codec.digest.DigestUtils;

@Component
public class AuthQueueListener {

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private AuthRepository repo;

	public String empacotaMensagem(String message, String payload){

		JSONObject newMessage = new JSONObject();
		newMessage.put("message", message);
		newMessage.put("payload", payload);
		return newMessage.toString();

	}

	public boolean deletarLogin(AuthDTO a){

		Auth auth = repo.findByLogin(a.getLogin());

		if(auth != null){
			repo.deleteById(auth.getId());
			return true;
		}

		return false;

	}

	public AuthDTO cadastrarLogin(AuthDTO a){

		a.setId(null);

		//Criptografia
		String pwd = DigestUtils.sha1Hex(a.getSenha());
		a.setSenha(pwd);
		
		Auth auth = mapper.map(a, Auth.class);
		Auth inserted = repo.save(auth);

		return mapper.map(inserted, AuthDTO.class);

	}

	//verifica se email ja esta presente
	public boolean validarLogin(AuthDTO a){

		Auth auth = repo.findByLogin(a.getLogin());

		if(auth == null){
			return true;
		}

		return false;
		
	}

	@RabbitListener(queues = "auth.v1.auth")
	public String consumirMensagem(String json){
			
		try {

			JSONObject messageObj = new JSONObject(json);
			String message = messageObj.get("message").toString();
			String payload = messageObj.get("payload").toString();
			System.out.println(message);

			switch(message) {
				case "CadastrarLogin":
		
					AuthDTO auth = objectMapper.readValue(payload, AuthDTO.class);	
					
					try{
						auth = cadastrarLogin(auth);
					}catch(DataIntegrityViolationException e){
						return empacotaMensagem("ConflitoCadastrarLogin", "");
					} 
					catch(Exception e){
						return empacotaMensagem("FalhaCadastrarLogin", "");
					}

					return empacotaMensagem("LoginCadastrado", objectMapper.writeValueAsString(auth));

				case "ValidarLogin":

					AuthDTO authValLogin = objectMapper.readValue(payload, AuthDTO.class);	

					try{
						if(validarLogin(authValLogin)){
							return empacotaMensagem("LoginValidado", "");
						}

						return empacotaMensagem("ConflitoValidarLogin", "");

					}catch(Exception e){
						return empacotaMensagem("FalhaValidarLogin", "");
					}

				case "DeletarLogin":
				  
					AuthDTO authDel = objectMapper.readValue(payload, AuthDTO.class);	
					
					if(deletarLogin(authDel)){
						return empacotaMensagem("LoginDeletado", "");
					}

					return empacotaMensagem("FalhaDeletarLogin", "");

				default:
				  return empacotaMensagem("FalhaCadastrarLogin", "");

	
			}

		} catch (JsonMappingException e) {
			return empacotaMensagem("MensagemInvalida", "");
		} catch(JsonProcessingException e){
			return empacotaMensagem("MensagemInvalida", "");
		}

	
	}
	
}

