package ufpr.dac.bantads.conta.model;

import java.io.Serializable;
import java.util.Date;

public class MovimentacaoDTO implements Serializable{

	// Attributes
	private Long id;
	private Long idConta;
	private Long idContaOrigem;
	private Long idContaDestino;
	private String tipo;
	private Date dataHora;
	private Float valor;
	private Float saldoApos;

	// Constructors
	public MovimentacaoDTO() {
		super();
	}

	public MovimentacaoDTO(Long id, Long idConta, Long idContaOrigem, Long idContaDestino, String tipo, Date dataHora, Float valor,
			Float saldoApos) {
		super();
		this.id = id;
		this.idConta = idConta;
		this.idContaOrigem = idContaOrigem;
		this.idContaDestino = idContaDestino;
		this.tipo = tipo;
		this.dataHora = dataHora;
		this.valor = valor;
		this.saldoApos = saldoApos;
	}

	// Getters & Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getIdContaOrigem() {
		return idContaOrigem;
	}

	public void setIdContaOrigem(Long idContaOrigem) {
		this.idContaOrigem = idContaOrigem;
	}

	public Long getIdContaDestino() {
		return idContaDestino;
	}

	public void setIdContaDestino(Long idContaDestino) {
		this.idContaDestino = idContaDestino;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public Date getDataHora() {
		return dataHora;
	}

	public void setDataHora(Date dataHora) {
		this.dataHora = dataHora;
	}

	public Float getValor() {
		return valor;
	}

	public void setValor(Float valor) {
		this.valor = valor;
	}

	public Float getSaldoApos() {
		return saldoApos;
	}

	public void setSaldoApos(Float saldoApos) {
		this.saldoApos = saldoApos;
	}

	public Long getIdConta() {
		return idConta;
	}

	public void setIdConta(Long idConta) {
		this.idConta = idConta;
	}


}
