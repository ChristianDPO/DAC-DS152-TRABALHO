package ufpr.dac.bantads.conta.contacud.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ufpr.dac.bantads.conta.model.MovimentacaoCud;

@Repository
public interface MovimentacaoCudRepository extends JpaRepository<MovimentacaoCud, Long> {

}
