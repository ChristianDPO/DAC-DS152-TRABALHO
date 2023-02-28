package ufpr.dac.bantads.conta.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import ufpr.dac.bantads.conta.contacud.repository.ContaCudRepository;
import ufpr.dac.bantads.conta.contaread.repository.ContaReadRepository;
import ufpr.dac.bantads.conta.contaread.repository.MovimentacaoReadRepository;
import ufpr.dac.bantads.conta.model.ContaCud;
import ufpr.dac.bantads.conta.model.ContaDTO;
import ufpr.dac.bantads.conta.model.ContaRead;
import ufpr.dac.bantads.conta.model.MovimentacaoDTO;
import ufpr.dac.bantads.conta.model.MovimentacaoRead;

@CrossOrigin
@RestController
@ComponentScan
public class ContaREST {

	@Autowired
	private ContaCudRepository repocud;
	
	@Autowired
	private ContaReadRepository reporead;

	@Autowired
	private MovimentacaoReadRepository repoMovread;

	@Autowired
	private ModelMapper mapper;

	// Methods

	@GetMapping("/contas")	
	public ResponseEntity<List<ContaDTO>> listarContas() {

		// Access ContaReadRepository
		List<ContaRead> contas = reporead.findAll();
		return ResponseEntity.ok()
				.body(contas.stream().map(conta -> mapper.map(conta, ContaDTO.class)).collect(Collectors.toList()));
	}

	@GetMapping("/contas/{id}")
	public ResponseEntity<ContaDTO> buscarConta(@PathVariable("id") Long id) {

		// Access ContaReadRepository
		return reporead.findById(id).map(conta -> ResponseEntity.ok().body(mapper.map(conta, ContaDTO.class)))
				.orElse(ResponseEntity.notFound().build());

	}
	
	@GetMapping("/clientes/{id}/contas")
	public ResponseEntity<ContaDTO> buscarContaPorIdCliente(@PathVariable("id") Long idCliente) {

		// Access ContaReadRepository
		ContaRead conta = reporead.findByIdCliente(idCliente);
		
		if(conta != null) {
			return ResponseEntity.ok().body(mapper.map(conta, ContaDTO.class));
		}
		
		return ResponseEntity.notFound().build();

	}
	

	@GetMapping("/contas/{id}/movimentacoes")
	public ResponseEntity<List<MovimentacaoDTO>> buscarMovimentacoesPorConta(@PathVariable("id") Long idConta) {

		List<MovimentacaoRead> movimentacoes = repoMovread.findByIdConta(idConta);
		return ResponseEntity.ok()
				.body(movimentacoes.stream().map(movimentacao -> mapper.map(movimentacao, MovimentacaoDTO.class)).collect(Collectors.toList()));

	}

	@PostMapping("/contas")
	public ResponseEntity<ContaDTO> inserirConta(@RequestBody ContaDTO c) {

		// Access ContaCudRepository
		ContaCud conta = repocud.save(mapper.map(c, ContaCud.class));
		return ResponseEntity.ok().body(mapper.map(conta, ContaDTO.class));

	}

	@PutMapping("/contas/{id}")
	public ResponseEntity<ContaDTO> alterarConta(@PathVariable("id") Long id, @RequestBody ContaDTO c) {

		// Access ContaCudRepository
		return repocud.findById(id).map(conta -> {
			conta.setIdCliente(c.getIdCliente());
			conta.setDataHoraAbertura(c.getDataHoraAbertura());
			conta.setSaldo(c.getSaldo());
			conta.setLimite(c.getLimite());

			ContaCud updated = repocud.save(conta);
			return ResponseEntity.ok().body(mapper.map(updated, ContaDTO.class));

		}).orElse(ResponseEntity.notFound().build());

	}

	@DeleteMapping("/contas/{id}")
	public ResponseEntity<ContaDTO> removerConta(@PathVariable("id") Long id) {

		// Access ContaCudRepository
		return repocud.findById(id).map(conta -> {
			repocud.deleteById(id);
			return ResponseEntity.ok().body(mapper.map(conta, ContaDTO.class));
		}).orElse(ResponseEntity.notFound().build());
	}

}
