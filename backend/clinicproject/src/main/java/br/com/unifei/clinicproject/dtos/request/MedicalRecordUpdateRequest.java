package br.com.unifei.clinicproject.dtos.request;

import lombok.Data;

@Data
public class MedicalRecordUpdateRequest {

  private String diagnosis;
  private String prescription;
  private String notes;
}
