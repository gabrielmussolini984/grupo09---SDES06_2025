package br.com.unifei.clinicproject.dtos.response;

import br.com.unifei.clinicproject.enums.UserRole;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserResponse {
  private String id;
  private String name;
  private String cpf;
  private String email;
  private UserRole role;
  private LocalDate admissionDate;
}
