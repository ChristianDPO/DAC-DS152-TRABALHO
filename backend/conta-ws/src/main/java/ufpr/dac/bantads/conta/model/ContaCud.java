package ufpr.dac.bantads.conta.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tb_conta")
public class ContaCud implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	// Attributes
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_conta")
	private Long id;
	
	@Column(name="id_cliente")
	private Long idCliente;
	
	@Column(name="data_hora_abertura", insertable = false, updatable = false)
	private Date dataHoraAbertura;
	
	@Column(name="saldo")
	private Float saldo;
	
	@Column(name="limite")
	private Float limite;

	// Constructors
	public ContaCud() {
		super();
	}

	public ContaCud(Long id, Long idCliente, Date dataHoraAbertura, Float saldo, Float limite) {
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
