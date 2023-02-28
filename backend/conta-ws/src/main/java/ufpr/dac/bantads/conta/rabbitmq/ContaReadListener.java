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

import ufpr.dac.bantads.conta.model.ContaRead;
import ufpr.dac.bantads.conta.model.ContaDTO;
import ufpr.dac.bantads.conta.contaread.repository.ContaReadRepository;

import ufpr.dac.bantads.conta.model.MovimentacaoRead;
import ufpr.dac.bantads.conta.model.MovimentacaoDTO;
import ufpr.dac.bantads.conta.contaread.repository.MovimentacaoReadRepository;


@Component
public class ContaReadListener {

    @Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private ContaReadRepository repoConta;

    @Autowired
	private MovimentacaoReadRepository repoMov;

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
            MovimentacaoRead movimentacao = mapper.map(movimentacaoDTO, MovimentacaoRead.class);
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
            MovimentacaoRead movimentacao = mapper.map(movimentacaoDTO, MovimentacaoRead.class);
            movimentacao.setSaldoApos(saldoApos);
            repoMov.save(movimentacao);
            
            return true;

        }).orElse(false);
        
    }

    public boolean realizarTransferencia(MovimentacaoDTO movimentacaoDTO){

        Long idContaOrigem = movimentacaoDTO.getIdContaOrigem();
        Long idContaDestino = movimentacaoDTO.getIdContaDestino();

        Optional <ContaRead> contaOrigem = repoConta.findById(idContaOrigem);
        Optional <ContaRead> contaDestino = repoConta.findById(idContaDestino);

        if(contaOrigem.isPresent() && contaDestino.isPresent()){

            contaOrigem.map(conta -> {
                
                Float saldoApos = conta.getSaldo() - movimentacaoDTO.getValor();
                conta.setSaldo(saldoApos);
                repoConta.save(conta);
    
                movimentacaoDTO.setId(null);
                movimentacaoDTO.setIdConta(idContaOrigem);
                MovimentacaoRead movimentacao = mapper.map(movimentacaoDTO, MovimentacaoRead.class);
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
                MovimentacaoRead movimentacao = mapper.map(movimentacaoDTO, MovimentacaoRead.class);
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

        ContaRead novaConta = repoConta.save(mapper.map(contaDTO, ContaRead.class));
        
        return mapper.map(novaConta, ContaDTO.class);

    }

    @RabbitListener(queues = "contaread.v1.contaread")
	public String consumirMensagem(String json){
			
		try {
			
			JSONObject messageObj = new JSONObject(json);
			String message = messageObj.get("message").toString();
			String payload = messageObj.get("payload").toString();
            JSONObject payloadObj = new JSONObject(payload);

			System.out.println(message);		
			switch(message) {
                case "AtualizarMovimentacao":

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
                        return empacotaMensagem("FalhaAtualizarMovimentacao", "");
                    } 
                    catch(Exception e){
                        return empacotaMensagem("FalhaAtualizarMovimentacao", "");
                    } 

                    if(!sucesso){
                        return empacotaMensagem("FalhaAtualizarMovimentacao", "");
                    }

                    return empacotaMensagem("MovimentacaoAtualizada", "");

                case "AtualizarConta": 
                    
                    //ContaDTO contaDTO = objectMapper.readValue(payload, ContaDTO.class);
                    Float salario = payloadObj.getFloat("salario");
                    Long  idCliente = payloadObj.getLong("id");

                    try{
                        
                        ContaDTO conta = cadastrarConta(idCliente, salario);  
                        return empacotaMensagem("ContaAtualizada", objectMapper.writeValueAsString(conta));

                    } catch(DataIntegrityViolationException e){
                        return empacotaMensagem("ConflitoAtualizarConta", "");
                    } 
                    catch(Exception e){
                        return empacotaMensagem("FalhaAtualizarConta", "");
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
