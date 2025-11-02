package br.com.unifei.clinicproject.dtos.request;

import br.com.unifei.clinicproject.enums.UserRole;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserFilterRequest {
  private String name;
  private String cpf;
  private UserRole role;
  private LocalDate admissionStart;
  private LocalDate admissionEnd;
}
