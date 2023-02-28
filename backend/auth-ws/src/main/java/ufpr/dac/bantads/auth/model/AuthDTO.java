package ufpr.dac.bantads.auth.model;

import java.io.Serializable;

public class AuthDTO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	// Attributes
	private Long id;
	private String login;
	private String senha;
	private String perfil;
	
	// Constructors
	public AuthDTO() {
		super();
	}
	
	public AuthDTO(String login, String senha) {
		super();
		this.login = login;
		this.senha = senha;
	}
	
	public AuthDTO(Long id, String login, String senha, String perfil) {
		super();
		this.id = id;
		this.login = login;
		this.senha = senha;
		this.perfil = perfil;
	}
	
	// Getters & Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getPerfil() {
		return perfil;
	}

	public void setPerfil(String perfil) {
		this.perfil = perfil;
	}

}
