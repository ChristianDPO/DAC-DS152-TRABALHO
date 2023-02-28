package ufpr.dac.bantads.auth.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import ufpr.dac.bantads.auth.model.Auth;

public interface AuthRepository extends JpaRepository<Auth, Long> {
	
	public Auth findByLogin(String login);

	@Query("from Auth where login = :login and senha = :senha")
	public Auth findByLoginAndSenha(@Param("login") String login,
									@Param("senha") String senha );


}
