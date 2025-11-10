package br.com.unifei.clinicproject.dtos.request;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class PetUpdateRequest {
  private Double weight;
  private String color;
  private String notes;
}
