package br.com.unifei.clinicproject.services;

import br.com.unifei.clinicproject.dtos.request.MedicalRecordRequest;
import br.com.unifei.clinicproject.entities.MedicalRecordEntity;
import br.com.unifei.clinicproject.entities.PetEntity;
import br.com.unifei.clinicproject.entities.UserEntity;
import br.com.unifei.clinicproject.enums.UserRole;
import br.com.unifei.clinicproject.repositories.MedicalRecordRepository;
import br.com.unifei.clinicproject.repositories.PetRepository;
import br.com.unifei.clinicproject.repositories.UserRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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

  //    private final MedicalRecordMapper mapper;

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
}
