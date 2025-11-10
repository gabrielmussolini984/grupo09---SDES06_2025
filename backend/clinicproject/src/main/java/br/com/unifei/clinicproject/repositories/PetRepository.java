package br.com.unifei.clinicproject.repositories;

import br.com.unifei.clinicproject.entities.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PetRepository
    extends JpaRepository<PetEntity, String>, JpaSpecificationExecutor<PetEntity> {}
