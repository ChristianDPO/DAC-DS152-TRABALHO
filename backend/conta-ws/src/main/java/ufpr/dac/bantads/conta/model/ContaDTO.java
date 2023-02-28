package ufpr.dac.bantads.conta.model;

import java.io.Serializable;
import java.util.Date;

public class ContaDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	// Attributes
	private Long id;
	private Long idCliente;
	private Date dataHoraAbertura;
	private Float saldo;
	private Float limite;

	// Constructors
	public ContaDTO() {
		super();
	}

	public ContaDTO(Long id, Long idCliente, Date dataHoraAbertura, Float saldo, Float limite) {
		super();
		this.id = id;
		this.idCliente = idCliente;
		this.dataHoraAbertura = dataHoraAbertura;
		this.saldo = saldo;
		this.limite = limite;
	}
	
	// Getters & Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getIdCliente() {
		return idCliente;
	}

	public void setIdCliente(Long idCliente) {
		this.idCliente = idCliente;
	}

	public Date getDataHoraAbertura() {
		return dataHoraAbertura;
	}

	public void setDataHoraAbertura(Date dataHoraAbertura) {
		this.dataHoraAbertura = dataHoraAbertura;
	}

	public Float getSaldo() {
		return saldo;
	}

	public void setSaldo(Float saldo) {
		this.saldo = saldo;
	}

	public Float getLimite() {
		return limite;
	}

	public void setLimite(Float limite) {
		this.limite = limite;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
