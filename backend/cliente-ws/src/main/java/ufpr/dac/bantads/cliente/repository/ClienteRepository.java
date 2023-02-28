package ufpr.dac.bantads.cliente.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ufpr.dac.bantads.cliente.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
	
	public List<Cliente> findByAprovado(Boolean aprovado);

	public List<Cliente> findByIdGerenteAndAprovado(Long Id, Boolean aprovado);

	public Cliente findByEmail(String email);
 
	public Cliente findByCpf(String cpf);

}
