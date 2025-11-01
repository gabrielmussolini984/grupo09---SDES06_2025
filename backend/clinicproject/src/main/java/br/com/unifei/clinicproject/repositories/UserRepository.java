package br.com.unifei.clinicproject.repositories;

import br.com.unifei.clinicproject.entities.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository
    extends JpaRepository<UserEntity, String>, JpaSpecificationExecutor<UserEntity> {

  Optional<UserEntity> findByEmail(String email);

  Optional<UserEntity> findByCpf(String cpf);

  Optional<UserEntity> findByUsername(String username);
}
