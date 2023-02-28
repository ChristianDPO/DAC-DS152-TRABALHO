package ufpr.dac.bantads.conta.contaread.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ufpr.dac.bantads.conta.model.MovimentacaoRead;

@Repository
public interface MovimentacaoReadRepository extends JpaRepository<MovimentacaoRead, Long> {

    public List<MovimentacaoRead> findByIdConta(Long idConta);

}
