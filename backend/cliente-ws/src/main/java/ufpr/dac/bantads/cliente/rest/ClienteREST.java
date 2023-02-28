package ufpr.dac.bantads.cliente.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import ufpr.dac.bantads.cliente.model.Cliente;
import ufpr.dac.bantads.cliente.model.ClienteDTO;
import ufpr.dac.bantads.cliente.model.Endereco;
import ufpr.dac.bantads.cliente.model.EnderecoDTO;
import ufpr.dac.bantads.cliente.repository.ClienteRepository;
import ufpr.dac.bantads.cliente.repository.EnderecoRepository;

@CrossOrigin
@RestController
public class ClienteREST {

	@Autowired
	private ClienteRepository repo;

	@Autowired
	private EnderecoRepository repoEnder;

	@Autowired
	private ModelMapper mapper;

	// Methods

	@GetMapping("/clientes")
	public ResponseEntity<?> filtrarClientes(	@RequestParam(name = "email", required = false) String email,
												@RequestParam(name = "cpf", required = false) String cpf,
												@RequestParam(name = "aprovado", required = false) Boolean aprovado ){

		if (email != null) {
			Cliente cliente = repo.findByEmail(email);
			
			if (cliente != null)
				return ResponseEntity.ok().body(mapper.map(cliente, ClienteDTO.class));

			return ResponseEntity.notFound().build();

		}

		else if (cpf != null) {
			Cliente cliente = repo.findByCpf(cpf);

			if (cliente != null)
				return ResponseEntity.ok().body(mapper.map(cliente, ClienteDTO.class));

			return ResponseEntity.notFound().build();
		}
		
		else if (aprovado) {
			List<Cliente> clientes = repo.findByAprovado(aprovado);
			
			return ResponseEntity.ok().body(
					clientes.stream().map(cliente -> mapper.map(cliente, ClienteDTO.class)).collect(Collectors.toList()));
		}

		List<Cliente> clientes = repo.findAll();
		
		return ResponseEntity.ok().body(
				clientes.stream().map(cliente -> mapper.map(cliente, ClienteDTO.class)).collect(Collectors.toList()));
	}

	@GetMapping("/clientes/{id}")
	public ResponseEntity<ClienteDTO> buscarCliente(@PathVariable("id") Long id) {

		return repo.findById(id).map(cliente -> ResponseEntity.ok().body(mapper.map(cliente, ClienteDTO.class)))
				.orElse(ResponseEntity.notFound().build());

	}

	@GetMapping("/gerentes/{id}/clientes")
	public ResponseEntity<List<ClienteDTO>> buscarGerenteClientes(	@PathVariable("id") Long id,
																	@RequestParam(name = "aprovado", required = true) Boolean aprovado) {
		
		List<Cliente> clientes = repo.findByIdGerenteAndAprovado(id, aprovado);
		return ResponseEntity.ok().body(
				clientes.stream().map(cliente -> mapper.map(cliente, ClienteDTO.class)).collect(Collectors.toList()));
		
	}

}
