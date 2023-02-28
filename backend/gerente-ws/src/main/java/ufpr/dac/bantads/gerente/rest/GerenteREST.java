package ufpr.dac.bantads.gerente.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.dao.DataIntegrityViolationException;

import ufpr.dac.bantads.gerente.model.Gerente;
import ufpr.dac.bantads.gerente.model.GerenteDTO;
import ufpr.dac.bantads.gerente.repository.GerenteRepository;

@CrossOrigin
@RestController
public class GerenteREST {

	@Autowired
	private GerenteRepository repo;

	@Autowired
	private ModelMapper mapper;

	// Methods
	@GetMapping("/gerentes")
	public ResponseEntity<?> filtrarGerentes(@RequestParam(name = "email", required = false) String email) {

		if(email != null) {
			
			Gerente gerente = repo.findByEmail(email);
			
			if(gerente != null) {
				return ResponseEntity.ok().body(mapper.map(gerente, GerenteDTO.class));
			}
			
			return ResponseEntity.notFound().build();
			
		}	
		
		List<Gerente> gerentes = repo.findAll();
		return ResponseEntity.ok().body(gerentes.stream().map(e -> mapper.map(e, GerenteDTO.class)).collect(Collectors.toList()));
	}

	@GetMapping("/gerentes/{id}")
	public ResponseEntity<GerenteDTO> buscarGerente(@PathVariable("id") Long id) {
		
		return repo.findById(id)
				.map(gerente -> ResponseEntity.ok().body(mapper.map(gerente, GerenteDTO.class)))
				.orElse(ResponseEntity.notFound().build());

	}

	@PutMapping("/gerentes/{id}")
	public ResponseEntity alterarGerente(@PathVariable("id") Long id, @RequestBody GerenteDTO g) {

		return repo.findById(id)
				.map(gerente -> {
					gerente.setNome(g.getNome());
					gerente.setEmail(g.getEmail());
					gerente.setCpf(g.getCpf());

					try{
						
						Gerente updated = repo.save(gerente);
						return ResponseEntity.ok().body(mapper.map(updated, GerenteDTO.class));

					} catch(DataIntegrityViolationException e){
						//conflito ao atualizar
						return ResponseEntity.status(409).build();
					}
	
				})
				.orElse(ResponseEntity.notFound().build());

	}

}
