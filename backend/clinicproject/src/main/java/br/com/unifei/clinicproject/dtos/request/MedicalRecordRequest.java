package br.com.unifei.clinicproject.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordRequest {
  @NotBlank private String petId;

  @NotBlank private String veterinarianId;

  @NotNull private LocalDate consultationDate;

  @NotBlank private String diagnosis;

  @NotBlank private String prescription;

  private String notes;
}
