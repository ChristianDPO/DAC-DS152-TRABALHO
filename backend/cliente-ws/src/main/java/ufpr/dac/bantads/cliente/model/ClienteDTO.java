package ufpr.dac.bantads.cliente.model;

import java.io.Serializable;
import ufpr.dac.bantads.cliente.model.EnderecoDTO;

public class ClienteDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	// Attributes
	private Long id;
	private Long idGerente;
	private String nome;
	private String email;
	private String cpf;
	private Float salario;
	private Boolean aprovado;
	private EnderecoDTO endereco;

	// Constructors
	public ClienteDTO() {
		super();
	}

	public ClienteDTO(Long id, Long idEndereco, Long idGerente, String nome, String email, String cpf, Float salario,
			Boolean aprovado, EnderecoDTO endereco) {
		super();
		this.id = id;
		this.idGerente = idGerente;
		this.nome = nome;
		this.email = email;
		this.cpf = cpf;
		this.salario = salario;
		this.aprovado = aprovado;
		this.endereco = endereco;
	}

	// Getters & Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getIdGerente() {
		return idGerente;
	}

	public void setIdGerente(Long idGerente) {
		this.idGerente = idGerente;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public Float getSalario() {
		return salario;
	}

	public void setSalario(Float salario) {
		this.salario = salario;
	}

	public Boolean getAprovado() {
		return aprovado;
	}

	public void setAprovado(Boolean aprovado) {
		this.aprovado = aprovado;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public EnderecoDTO getEndereco() {
		return endereco;
	}

	public void setEndereco(EnderecoDTO endereco) {
		this.endereco = endereco;
	}

}
