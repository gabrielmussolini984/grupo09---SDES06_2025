package br.com.unifei.clinicproject.dtos.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PetResponse {
  private String id;
  private String name;
  private String species;
  private String breed;
  private Integer age;
  private String tutorName;
  private String tutorCpf;
  private BigDecimal weight;
  private String notes;
}
