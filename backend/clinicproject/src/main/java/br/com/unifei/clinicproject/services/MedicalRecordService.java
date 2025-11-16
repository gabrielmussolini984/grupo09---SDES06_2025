package br.com.unifei.clinicproject.services;

import br.com.unifei.clinicproject.dtos.request.MedicalRecordRequest;
import br.com.unifei.clinicproject.dtos.request.MedicalRecordUpdateRequest;
import br.com.unifei.clinicproject.dtos.response.MedicalRecordResponse;
import br.com.unifei.clinicproject.entities.MedicalRecordEntity;
import br.com.unifei.clinicproject.entities.PetEntity;
import br.com.unifei.clinicproject.entities.UserEntity;
import br.com.unifei.clinicproject.enums.UserRole;
import br.com.unifei.clinicproject.mappers.MedicalMapper;
import br.com.unifei.clinicproject.repositories.MedicalRecordRepository;
import br.com.unifei.clinicproject.repositories.PetRepository;
import br.com.unifei.clinicproject.repositories.UserRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Log4j2
@Service
@RequiredArgsConstructor
public class MedicalRecordService {

  private final PetRepository petRepository;
  private final UserRepository userRepository;
  private final MedicalRecordRepository medicalRecordRepository;
  private final FileStorageService fileStorageService;

  private final MedicalMapper mapper;

  public List<MedicalRecordResponse> search(
      String petId,
      LocalDate startDate,
      LocalDate endDate,
      String veterinarianId,
      String diagnosisKeyword) {

    var spec = filter(petId, startDate, endDate, veterinarianId, diagnosisKeyword);

    List<MedicalRecordEntity> records =
        medicalRecordRepository.findAll(
            spec, Sort.by(Sort.Direction.DESC, "consultationDate") // mais recente → mais antigo
            );

    return mapper.toResponseDto(records);
  }

  private Specification<MedicalRecordEntity> filter(
      String petId,
      LocalDate startDate,
      LocalDate endDate,
      String veterinarianId,
      String diagnosisKeyword) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      // Pet (obrigatório)
      predicates.add(cb.equal(root.get("pet").get("id"), petId));

      // Data (intervalo)
      if (startDate != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("consultationDate"), startDate));
      }

      if (endDate != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("consultationDate"), endDate));
      }

      // Veterinário
      if (veterinarianId != null) {
        predicates.add(cb.equal(root.get("veterinarian").get("id"), veterinarianId));
      }

      // Diagnóstico (keyword, LIKE)
      if (diagnosisKeyword != null && !diagnosisKeyword.isBlank()) {
        predicates.add(
            cb.like(cb.lower(root.get("diagnosis")), "%" + diagnosisKeyword.toLowerCase() + "%"));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  public void createRecord(MedicalRecordRequest dto, List<MultipartFile> attachments)
      throws IllegalAccessException {

    UserEntity vet =
        userRepository
            .findById(dto.getVeterinarianId())
            .orElseThrow(() -> new IllegalArgumentException("Veterinarian not found"));

    if (vet.getRole() != UserRole.VETERINARIO) {
      throw new IllegalAccessException("Only veterinarians can register medical records");
    }

    PetEntity pet =
        petRepository
            .findById(dto.getPetId())
            .orElseThrow(() -> new IllegalArgumentException("Pet not found"));

    var record =
        MedicalRecordEntity.builder()
            .pet(pet)
            .veterinarian(vet)
            .consultationDate(dto.getConsultationDate())
            .diagnosis(dto.getDiagnosis())
            .prescription(dto.getPrescription())
            .notes(dto.getNotes());

    // Save files
    if (attachments != null) {
      List<String> savedFiles = new ArrayList<>();
      for (MultipartFile file : attachments) {
        String filename = fileStorageService.saveFile(file);
        savedFiles.add(filename);
      }
      record.attachments(savedFiles);
    }

    medicalRecordRepository.save(record.build());

    log.info("Medical record saved successfully!");
  }

  @Transactional
  public void updateRecord(
      String id, MedicalRecordUpdateRequest dto, List<MultipartFile> newFiles, String loggedVetId)
      throws Exception {

    MedicalRecordEntity entity =
        medicalRecordRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Record not found"));

    // todo impl login
    //
    //    if (!entity.getVeterinarian().getId().equals(loggedVetId)) {
    //      throw new IllegalAccessException(
    //              "Only the veterinarian who created the record can edit it."
    //      );
    //    }

    if (dto.getDiagnosis() != null) entity.setDiagnosis(dto.getDiagnosis());
    if (dto.getPrescription() != null) entity.setPrescription(dto.getPrescription());
    if (dto.getNotes() != null) entity.setNotes(dto.getNotes());

    if (newFiles != null && !newFiles.isEmpty()) {
      List<String> savedFiles = new ArrayList<>();
      for (MultipartFile file : newFiles) {
        String filename = fileStorageService.saveFile(file);
        savedFiles.add(filename);
      }

      if (entity.getAttachments() == null) {
        entity.setAttachments(new ArrayList<>());
      }

      entity.getAttachments().addAll(savedFiles);
    }

    entity.setLastModifiedDate(OffsetDateTime.now());
    entity.setLastModifiedBy(loggedVetId);

    medicalRecordRepository.save(entity);
  }
}
