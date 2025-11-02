package br.com.unifei.clinicproject.repositories;

import br.com.unifei.clinicproject.entities.TutorEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TutorRepository
    extends JpaRepository<TutorEntity, String>, JpaSpecificationExecutor<TutorEntity> {

  Optional<TutorEntity> findByEmail(String email);

  Optional<TutorEntity> findByCpf(String cpf);
//
//  Optional<TutorEntity> findByUsername(String username);
//
//  boolean existsByEmailAndIdNot(String email, String id);
}
