package br.com.unifei.clinicproject.repositories;

import br.com.unifei.clinicproject.entities.MedicalRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalRecordRepository
    extends JpaRepository<MedicalRecordEntity, String>,
        JpaSpecificationExecutor<MedicalRecordEntity> {}
