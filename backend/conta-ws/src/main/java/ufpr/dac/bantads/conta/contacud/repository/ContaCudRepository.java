package ufpr.dac.bantads.conta.contacud.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ufpr.dac.bantads.conta.model.ContaCud;

@Repository
public interface ContaCudRepository extends JpaRepository<ContaCud, Long> {

	public ContaCud findByIdCliente(Long idCliente);
	
}
