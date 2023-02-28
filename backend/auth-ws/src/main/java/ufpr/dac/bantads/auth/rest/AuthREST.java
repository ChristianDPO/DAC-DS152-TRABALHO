package ufpr.dac.bantads.auth.rest;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import ufpr.dac.bantads.auth.model.Auth;
import ufpr.dac.bantads.auth.model.AuthDTO;
import ufpr.dac.bantads.auth.repository.AuthRepository;

import org.apache.commons.codec.digest.DigestUtils;

@CrossOrigin
@RestController
public class AuthREST {
	
	@Autowired
	private AuthRepository repo;
	
	@Autowired
	private ModelMapper mapper;
	
	// Methods
	
	@PostMapping("/login")
	public ResponseEntity<AuthDTO> efetuarLogin(@RequestBody AuthDTO loginInfo) {
		
		//Criptografia
		String pwd = DigestUtils.sha1Hex(loginInfo.getSenha());
		loginInfo.setSenha(pwd);

		Auth usuarioInfo = repo.findByLoginAndSenha(loginInfo.getLogin(), loginInfo.getSenha());
		
		if(usuarioInfo != null) {
			AuthDTO authdto = mapper.map(usuarioInfo, AuthDTO.class);
			authdto.setSenha(null); //Por questoes de seguranca, nao envia a senha de volta
			return ResponseEntity.ok().body(authdto);
		}
		else
			return ResponseEntity.status(401).build();
		
		
	}

}
