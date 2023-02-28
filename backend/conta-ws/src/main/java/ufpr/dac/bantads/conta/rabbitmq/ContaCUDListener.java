package ufpr.dac.bantads.conta.rabbitmq;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONObject;

import java.util.Optional;

import org.json.JSONException;
import org.modelmapper.ModelMapper;

import ufpr.dac.bantads.conta.model.ContaCud;
import ufpr.dac.bantads.conta.model.ContaDTO;
import ufpr.dac.bantads.conta.contacud.repository.ContaCudRepository;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

import ufpr.dac.bantads.conta.model.MovimentacaoCud;
import ufpr.dac.bantads.conta.model.MovimentacaoDTO;
import ufpr.dac.bantads.conta.contacud.repository.MovimentacaoCudRepository;

@Component
public class ContaCUDListener {

	@Autowired
	private RabbitTemplate rabbitTemplate;

    @Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private ContaCudRepository repoConta;

    @Autowired
	private MovimentacaoCudRepository repoMov;

    public String empacotaMensagem(String message, String payload){

		JSONObject newMessage = new JSONObject();
		newMessage.put("message", message);
		newMessage.put("payload", payload);
		return newMessage.toString();

	}

    public boolean realizarSaque(MovimentacaoDTO movimentacaoDTO){

        Long idContaOrigem = movimentacaoDTO.getIdContaOrigem();

        return repoConta.findById(idContaOrigem).map(conta -> {

            Float saldoApos = conta.getSaldo() - movimentacaoDTO.getValor();
            conta.setSaldo(saldoApos);
            repoConta.save(conta);

            movimentacaoDTO.setId(null);
            movimentacaoDTO.setIdConta(idContaOrigem);
            movimentacaoDTO.setIdContaDestino(idContaOrigem);
            MovimentacaoCud movimentacao = mapper.map(movimentacaoDTO, MovimentacaoCud.class);
            movimentacao.setSaldoApos(saldoApos);
            repoMov.save(movimentacao);
            
            return true;

        }).orElse(false);
        
    }


    public boolean realizarDeposito(MovimentacaoDTO movimentacaoDTO){

        Long idContaOrigem = movimentacaoDTO.getIdContaOrigem();

        return repoConta.findById(idContaOrigem).map(conta -> {

            Float saldoApos = conta.getSaldo() + movimentacaoDTO.getValor();
            conta.setSaldo(saldoApos);
            repoConta.save(conta);

            movimentacaoDTO.setId(null);
            movimentacaoDTO.setIdConta(idContaOrigem);
            movimentacaoDTO.setIdContaDestino(idContaOrigem);
            MovimentacaoCud movimentacao = mapper.map(movimentacaoDTO, MovimentacaoCud.class);
            movimentacao.setSaldoApos(saldoApos);
            repoMov.save(movimentacao);
            
            return true;

        }).orElse(false);
        
    }

    public boolean realizarTransferencia(MovimentacaoDTO movimentacaoDTO){

        Long idContaOrigem = movimentacaoDTO.getIdContaOrigem();
        Long idContaDestino = movimentacaoDTO.getIdContaDestino();

        Optional <ContaCud> contaOrigem = repoConta.findById(idContaOrigem);
        Optional <ContaCud> contaDestino = repoConta.findById(idContaDestino);

        if(contaOrigem.isPresent() && contaDestino.isPresent()){

            contaOrigem.map(conta -> {
                
                Float saldoApos = conta.getSaldo() - movimentacaoDTO.getValor();
                conta.setSaldo(saldoApos);
                repoConta.save(conta);
    
                movimentacaoDTO.setId(null);
                movimentacaoDTO.setIdConta(idContaOrigem);
                MovimentacaoCud movimentacao = mapper.map(movimentacaoDTO, MovimentacaoCud.class);
                movimentacao.setSaldoApos(saldoApos);
                repoMov.save(movimentacao);

                return true;
            });

            contaDestino.map(conta -> {
                
                Float saldoApos = conta.getSaldo() + movimentacaoDTO.getValor();
                conta.setSaldo(saldoApos);
                repoConta.save(conta);
    
                movimentacaoDTO.setId(null);
                movimentacaoDTO.setIdConta(idContaDestino);
                MovimentacaoCud movimentacao = mapper.map(movimentacaoDTO, MovimentacaoCud.class);
                movimentacao.setSaldoApos(saldoApos);
                repoMov.save(movimentacao);

                return true;
            });

            return true;

        }

        return false;
    }

    public ContaDTO cadastrarConta(Long idCliente, Float salario){
        
        Float limite = 0.0f;

        if(salario >= 2000.0f){
            limite = (Float) salario / 2;
        }

        ContaDTO contaDTO = new ContaDTO();
        contaDTO.setId(null);
        contaDTO.setIdCliente(idCliente);
        contaDTO.setLimite(limite);
        contaDTO.setSaldo(0.0f);
        //contaDTO.setDataHoraAbertura(new Date());

        ContaCud novaConta = repoConta.save(mapper.map(contaDTO, ContaCud.class));
        
        return mapper.map(novaConta, ContaDTO.class);

    }

    @RabbitListener(queues = "contacud.v1.contacud")
	public String consumirMensagem(String json){
			
		try {
			
			JSONObject messageObj = new JSONObject(json);
			String message = messageObj.get("message").toString();
			String payload = messageObj.get("payload").toString();
    
            JSONObject payloadObj = new JSONObject(payload);
            JSONObject messageReceive = new JSONObject();
            
            String messageSend = "";
            String jsonResponse = "";

			System.out.println(message);		
			switch(message) {
                case "CadastrarMovimentacao":

                    String tipo = payloadObj.getString("tipo");
                    MovimentacaoDTO movimentacaoDTO = objectMapper.readValue(payload, MovimentacaoDTO.class);
                    boolean sucesso = false;

                    try{
                        if(tipo.equals("saq")){
                            sucesso = realizarSaque(movimentacaoDTO);
                        }
                        else if(tipo.equals("dep")){
                            sucesso = realizarDeposito(movimentacaoDTO);
                        }
                        else if(tipo.equals("tra")){
                            sucesso = realizarTransferencia(movimentacaoDTO);
                        }
                        else{
                            return empacotaMensagem("MensagemInvalida", "");
                        }
                    } catch(DataIntegrityViolationException e){
                        return empacotaMensagem("FalhaCadastrarMovimentacao", "");
                    } 
                    catch(Exception e){
                        return empacotaMensagem("FalhaCadastrarMovimentacao", "");
                    } 

                    if(!sucesso){
                        return empacotaMensagem("FalhaCadastrarMovimentacao", "");
                    }

                    messageSend = empacotaMensagem("AtualizarMovimentacao", payload);
                    jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","contaread.v1.contaread", messageSend);

                    messageReceive = new JSONObject(jsonResponse); 
                    message = messageReceive.get("message").toString();
                    payload = messageReceive.get("payload").toString();

                    System.out.println(message);
                    System.out.println(payload);
                    switch(message) {
                    	case "MovimentacaoAtualizada":
                    		return empacotaMensagem("MovimentacaoCadastrada", "");
                    	case "FalhaAtualizarMovimentacao":
                            return empacotaMensagem("FalhaCadastrarMovimentacao", "");			
                    	default:
                            return empacotaMensagem("FalhaCadastrarMovimentacao", "");	
                    }

                case "CadastrarConta": 
                    
                    //ContaDTO contaDTO = objectMapper.readValue(payload, ContaDTO.class);
                    Float salario = payloadObj.getFloat("salario");
                    Long  idCliente = payloadObj.getLong("id");
                    ContaDTO conta = new ContaDTO();

                    try{
                        conta = cadastrarConta(idCliente, salario);  
                    } catch(DataIntegrityViolationException e){
                        return empacotaMensagem("ConflitoCadastrarConta", "");
                    } 
                    catch(Exception e){
                        return empacotaMensagem("FalhaCadastrarConta", "");
                    } 

                    messageSend = empacotaMensagem("AtualizarConta", payload);
                    jsonResponse = (String) rabbitTemplate.convertSendAndReceive("","contaread.v1.contaread", messageSend);

                    messageReceive = new JSONObject(jsonResponse); 
                    message = messageReceive.get("message").toString();
                    payload = messageReceive.get("payload").toString();

                    System.out.println(message);
                    System.out.println(payload);
                    switch(message) {
                    	case "ContaAtualizada":
                    		return empacotaMensagem("ContaCadastrada", "");
                    	case "FalhaAtualizarConta":
                            return empacotaMensagem("FalhaCadastrarConta", "");			
                    	default:
                            return empacotaMensagem("FalhaCadastrarConta", "");	
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
