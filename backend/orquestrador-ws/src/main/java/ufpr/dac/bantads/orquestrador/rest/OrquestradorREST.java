package ufpr.dac.bantads.orquestrador.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import ufpr.dac.bantads.orquestrador.email.EmailSenderService;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

import org.apache.commons.text.RandomStringGenerator;

import java.util.Map;

import javax.mail.MessagingException;

import org.json.JSONObject;
import org.json.JSONException;

@CrossOrigin
@RestController
public class OrquestradorREST {

	@Autowired
	private RabbitTemplate rabbitTemplate;
	
	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private EmailSenderService senderService;


	public void enviarEmailResultado(boolean aprovado, String email, String senha, String razao) throws MessagingException {
		String titulo;
		String corpo;
		
		if (aprovado) {
			titulo = "Conta aprovada - BANTADS";
			corpo = "Parabéns " + email + ", sua conta no BANTADS foi aprovada."
					+ "\n Para se conectar à sua conta, acesse nosso site e fazer login com os seguintes dados:"
					+ "\n Email: " + email + "\n Senha: " + senha;
			System.out.println("Senha: " + senha);
		}
		else {
			titulo = "Conta reprovada - BANTADS";
			corpo = "Olá " + email + ", infelizmente sua conta no BANTADS foi reprovada."
					+ "\n A abertura de sua conta foi reprovada com a seguinte justificativa:"
					+ "\n  " + razao;
			System.out.println("Motivo: " + razao);
		}

		senderService.sendSimpleEmail(email, titulo, corpo);

	}


	public String empacotaMensagem(String message, String payload){

		JSONObject newMessage = new JSONObject();
		newMessage.put("message", message);
		newMessage.put("payload", payload);
		return newMessage.toString();

	}

	@PostMapping("/clientes")
	public ResponseEntity iniciarAutocadastro(@RequestBody String jsonCliente) {
		
		//mesagem: ValidarLogin
		//payload: {'login': 'emailcliente', 'perfil': 'CLI'}
		//resposta: string nula
		//funcao: verifica se existe um email similar na tabela de auth
		
		JSONObject payloadObj = new JSONObject(jsonCliente); 
		String login = payloadObj.get("email").toString();

		JSONObject loginObj = new JSONObject(); 
		loginObj.put("login", login);
		loginObj.put("perfil", "CLI");

		String messageSend = empacotaMensagem("ValidarLogin", loginObj.toString());
		String jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","auth.v1.auth", messageSend);

		JSONObject messageReceive = new JSONObject(jsonResponse); 
		String message = messageReceive.get("message").toString();
		String payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "LoginValidado":
				break;
			case "ConflitoValidarLogin":
				return ResponseEntity.status(HttpStatus.CONFLICT).build();
			case "FalhaValidarLogin":
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
			default:
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		//mensagem: ValidarGerente
		//payload: jsonCliente recebido da request
		//resposta: jsonCLiente enviado com o campo 'idGerente' preenchido corretamente
		//funcao: retornar o jsonCLiente enviado com o campo 'idGerente' preenchido corretamente, atualizar num_clientes do Gerente
		
		messageSend = empacotaMensagem("ValidarGerente", jsonCliente);
		jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend);

		messageReceive = new JSONObject(jsonResponse); 
		message = messageReceive.get("message").toString();
		payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "GerenteValidado":
				break;
			case "FalhaValidarGerente":
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();			
			default:
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		String payloadValidarGerente = new String(payload);

		//mensagem: CadastrarCliente
		//payload: valor recebido da ultima mensagem (cliente com idGerente preenchido)
		//resposta: cliente cadastrado
		//funcao: cadastrar o cliente recebido no banco de dados

		messageSend = empacotaMensagem("CadastrarCliente", payload);
		jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","clientes.v1.clientes", messageSend);

		messageReceive = new JSONObject(jsonResponse); 
		message = messageReceive.get("message").toString();
		payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "ClienteCadastrado":
				break;
			case "ConflitoCadastrarCliente":

				messageSend = empacotaMensagem("ReverterValidarGerente", payloadValidarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));
				return ResponseEntity.status(HttpStatus.CONFLICT).build();	
		
			case "FalhaCadastrarCliente":

				messageSend = empacotaMensagem("ReverterValidarGerente", payloadValidarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));

				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();			
			
			default:

				messageSend = empacotaMensagem("ReverterValidarGerente", payloadValidarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));

				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		String payloadCadastrarCliente = new String(payload);

		//mensagem: AtualizarConta
		//payload: valor recebido da ultima mensagem (cliente preenchido)
		//resposta: conta cadastrada
		//funcao: cadastrar a conta no banco de dados baseado nos detalhes do cliente

		messageSend = empacotaMensagem("CadastrarConta", payloadCadastrarCliente);
		jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","contacud.v1.contacud", messageSend);

		messageReceive = new JSONObject(jsonResponse); 
		message = messageReceive.get("message").toString();
		payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "ContaCadastrada":
				break;
			case "ConflitoCadastrarConta":

				messageSend = empacotaMensagem("ReverterValidarGerente", payloadValidarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));
			
				messageSend = empacotaMensagem("DeletarCliente", payloadCadastrarCliente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","clientes.v1.clientes", messageSend));
				
				return ResponseEntity.status(HttpStatus.CONFLICT).build();	
		
			case "FalhaCadastrarConta":

				messageSend = empacotaMensagem("ReverterValidarGerente", payloadValidarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));
			
				messageSend = empacotaMensagem("DeletarCliente", payloadCadastrarCliente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","clientes.v1.clientes", messageSend));

				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();			
			
			default:

				messageSend = empacotaMensagem("ReverterValidarGerente", payloadValidarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));
			
				messageSend = empacotaMensagem("DeletarCliente", payloadCadastrarCliente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","clientes.v1.clientes", messageSend));

				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		return ResponseEntity.ok().build();
	
	}

	@PutMapping("/clientes/{id}")
	public ResponseEntity avaliarAutocadastro(@PathVariable Long id, @RequestBody String jsonCliente) {
	
		//Recupera email
		String login = "";
		boolean aprovado = false;
		String senha = "";
		String mensagemReprovacao = "";

		try{

			JSONObject payloadObj = new JSONObject(jsonCliente); 
			login = payloadObj.get("email").toString();
			aprovado = payloadObj.getBoolean("aprovado");
		
			if(aprovado){

				RandomStringGenerator pwdGenerator = new RandomStringGenerator.Builder()
				.selectFrom("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".toCharArray())
				.build();
	
				senha = pwdGenerator.generate(8);

				//Adiciona o id correto no corpo da mensagem
				payloadObj.put("id", id);
				jsonCliente = payloadObj.toString();

			}
			else{
				
				mensagemReprovacao = payloadObj.get("mensagemReprovacao").toString();
				try{
					enviarEmailResultado(aprovado, login, senha, mensagemReprovacao);
				} catch(Exception e){
					System.out.println("Falha ao enviar o email");	
				}
				
				return ResponseEntity.ok().build();
			}
	
		}catch(JSONException e){
			ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
		}

		//mensagem: AprovarCliente
		//payload: cliente para aprovar
		//resposta: string nula
		//funcao: aprovar o cliente recebido no banco de dados

		String messageSend = empacotaMensagem("AprovarCliente", jsonCliente);
		String jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","clientes.v1.clientes", messageSend);

		JSONObject messageReceive = new JSONObject(jsonResponse); 
		String message = messageReceive.get("message").toString();
		String payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "ClienteAprovado":
				break;
			case "FalhaAprovarCliente":
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();			
			default:
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		//mesagem: CadastrarLogin
		//payload: {'login': 'emailcliente', 'perfil': 'CLI'}
		//resposta: string nula
		//funcao: cadastra o login e a senha (gerada aleatoriamente no microsservico) no banco

		JSONObject loginObj = new JSONObject(); 
		loginObj.put("login", login);
		loginObj.put("senha", senha);
		loginObj.put("perfil", "CLI");

		messageSend = empacotaMensagem("CadastrarLogin", loginObj.toString());
		jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","auth.v1.auth", messageSend);

		messageReceive = new JSONObject(jsonResponse); 
		message = messageReceive.get("message").toString();
		payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "LoginCadastrado":
				break;
			case "ConflitoCadastrarLogin":			
				
				messageSend = empacotaMensagem("ReverterAprovarCliente", jsonCliente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","clientes.v1.clientes", messageSend));
				
				return ResponseEntity.status(HttpStatus.CONFLICT).build();

			case "FalhaCadastrarLogin":		
			
				messageSend = empacotaMensagem("ReverterAprovarCliente", jsonCliente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","clientes.v1.clientes", messageSend));

				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();

			default:
			
				messageSend = empacotaMensagem("ReverterAprovarCliente", jsonCliente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","clientes.v1.clientes", messageSend));

				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		try{
			enviarEmailResultado(aprovado, login, senha, mensagemReprovacao);
		} catch(Exception e){
			System.out.println("Falha ao enviar o email");	
		}

		return ResponseEntity.ok().build();

	}

	@PostMapping("/gerentes")
	public ResponseEntity cadastrarGerente(@RequestBody String jsonGerente) {
		
		//Recupera senha e email
		String login = "";
		String senha = "";

		try{

			JSONObject payloadObj = new JSONObject(jsonGerente); 
			login = payloadObj.get("email").toString();
			senha = payloadObj.get("senha").toString();
		
		}catch(JSONException e){
			ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
		}

		//mensagem: CadastrarGerente
		//payload: jsonGerente recebido da request
		//resposta: gerente cadastrado
		//funcao: cadastrar o gerente recebido no banco de dados

		String messageSend = empacotaMensagem("CadastrarGerente", jsonGerente);
		String jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend);

		JSONObject messageReceive = new JSONObject(jsonResponse); 
		String message = messageReceive.get("message").toString();
		String payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "GerenteCadastrado":
				break;
			case "FalhaCadastrarGerente":
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
			case "ConflitoCadastrarGerente":
				return ResponseEntity.status(HttpStatus.CONFLICT).build();				
			default:
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		String payloadDeletarGerente = new String(payload);

		// mesagem: CadastrarLogin
		// payload: {'login': 'emailgerente', 'perfil': 'GER'}
		// resposta: string nula
		// funcao: cadastra o login e a senha no banco

		JSONObject loginObj = new JSONObject(); 
		loginObj.put("login", login);
		loginObj.put("senha", senha);
		loginObj.put("perfil", "GER");

		messageSend = empacotaMensagem("CadastrarLogin", loginObj.toString());
		jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","auth.v1.auth", messageSend);

		messageReceive = new JSONObject(jsonResponse); 
		message = messageReceive.get("message").toString();
		payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "LoginCadastrado":
				break;
			case "ConflitoCadastrarLogin":

				messageSend = empacotaMensagem("DeletarGerente", payloadDeletarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));

			case "FalhaCadastrarLogin":

				messageSend = empacotaMensagem("DeletarGerente", payloadDeletarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));

				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();			
			default:

				messageSend = empacotaMensagem("DeletarGerente", payloadDeletarGerente);
				System.out.println(rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend));

				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}
		return ResponseEntity.ok().build();
	
	}


	@DeleteMapping("/gerentes/{id}")
	public ResponseEntity deletarGerente(@PathVariable Long id, @RequestBody String jsonGerente) {
		
		//Recupera email
		String login = "";

		try{

			JSONObject payloadObj = new JSONObject(jsonGerente); 
			login = payloadObj.get("email").toString();
			
			//Adiciona o id correto no corpo da mensagem
			payloadObj.put("id", id);
			jsonGerente = payloadObj.toString();

		}catch(JSONException e){
			ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
		}

		//mensagem: DeletarGerente
		//payload: jsonGerente recebido da request
		//resposta: string vazia
		//funcao: deletar o gerente recebido no banco de dados

		String messageSend = empacotaMensagem("DeletarGerente", jsonGerente);
		String jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","gerentes.v1.gerentes", messageSend);

		JSONObject messageReceive = new JSONObject(jsonResponse); 
		String message = messageReceive.get("message").toString();
		String payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "GerenteDeletado":
				break;
			case "FalhaDeletarGerente":
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();			
			default:
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		// mesagem: DeletarLogin
		// payload: {'login': 'emailgerente', 'perfil': 'GER'}
		// resposta: string nula
		// funcao: deleta um registro na tabela auth baseado no login

		JSONObject loginObj = new JSONObject(); 
		loginObj.put("login", login);
		loginObj.put("perfil", "GER");

		messageSend = empacotaMensagem("DeletarLogin", loginObj.toString());
		jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","auth.v1.auth", messageSend);

		messageReceive = new JSONObject(jsonResponse); 
		message = messageReceive.get("message").toString();
		payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "LoginDeletado":
				break;
			case "FalhaDeletarLogin":
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();			
			default:
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}
		return ResponseEntity.ok().build();
	
	}

	@PostMapping("/movimentacoes")
	public ResponseEntity realizarMovimentacao(@RequestBody String jsonMovimentacao) {
	
		// mensagem: CadastrarMovimentacao
		// payload: jsonMovimentacao recebido da request
		// resposta: movimentacao cadastrada
		// funcao: cadastrar movimentacao na database de c-u-d
		
		String messageSend = empacotaMensagem("CadastrarMovimentacao", jsonMovimentacao);
		String jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","contacud.v1.contacud", messageSend);

		JSONObject messageReceive = new JSONObject(jsonResponse); 
		String message = messageReceive.get("message").toString();
		String payload = messageReceive.get("payload").toString();

		System.out.println(message);
		System.out.println(payload);
		switch(message) {
			case "MovimentacaoCadastrada":
				break;
			case "FalhaCadastrarMovimentacao":
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();			
			default:
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();	
		}

		return ResponseEntity.ok().build();
	}
	
}
