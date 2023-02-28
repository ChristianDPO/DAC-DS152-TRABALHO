package ufpr.dac.bantads.conta.contaread.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ufpr.dac.bantads.conta.model.ContaRead;

@Repository
public interface ContaReadRepository extends JpaRepository<ContaRead, Long> {

	public ContaRead findByIdCliente(Long idCliente);
	
}
