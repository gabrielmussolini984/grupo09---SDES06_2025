package br.com.unifei.clinicproject.dtos.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MedicalRecordResponse {

  private String id;
  private LocalDate consultationDate;
  private String veterinarianName;
  private String diagnosis;
  private String prescription;
  private String notes;
  private String veterinarianId;
  private String tutorId;
  private String petId;

  private List<String> attachmentPaths;
}
