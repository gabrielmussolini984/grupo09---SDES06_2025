package br.com.unifei.clinicproject.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetCreateRequest {

  private String name;
  private String species;
  private String breed;
  private String sex;
  private LocalDate birthDate;
  private String color;
  private Double weight;
  private String notes;
}
