package ufpr.dac.bantads.conta.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.TemporalType;


@Entity
@Table(name = "tb_movimentacao")
public class MovimentacaoCud {

	// Attributes

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_movimentacao")
	private Long id;

	@Column(name = "id_conta")
	private Long idConta;

	@Column(name = "id_conta_origem")
	private Long idContaOrigem;

	@Column(name = "id_conta_destino")
	private Long idContaDestino;

	@Column(name = "tipo")
	private String tipo;

	@Column(name = "data_hora", insertable = false, updatable = false)
	private Date dataHora;

	@Column(name = "valor")
	private Float valor;

	@Column(name = "saldo_apos")
	private Float saldoApos;
	
	// Constructors
	public MovimentacaoCud() {
		super();
	}

	public MovimentacaoCud(Long id, Long idConta, Long idContaOrigem, Long idContaDestino, String tipo, Date dataHora, Float valor,
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
