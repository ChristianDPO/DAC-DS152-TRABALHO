package ufpr.dac.bantads.gerente.repository;
import org.springframework.data.jpa.repository.*;

import ufpr.dac.bantads.gerente.model.Gerente;

public interface GerenteRepository extends JpaRepository<Gerente, Long> {
	
	public Gerente findByEmail(String email);
	
	@Query(
		value = "SELECT * FROM tb_gerente g WHERE num_clientes = ( SELECT MIN(num_clientes) FROM tb_gerente ) ORDER BY id_gerente LIMIT 1", 
		nativeQuery = true
	)
	public Gerente findByMinNumClientes();
	
}
