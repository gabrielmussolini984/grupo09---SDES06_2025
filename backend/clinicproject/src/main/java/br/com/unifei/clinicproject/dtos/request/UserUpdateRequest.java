package br.com.unifei.clinicproject.dtos.request;

import br.com.unifei.clinicproject.enums.UserRole;
import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
  @Pattern(regexp = "\\d{10,15}", message = "Telefone deve conter de 10 a 15 dígitos numéricos")
  private String phone;

  @Email(message = "E-mail inválido")
  @Size(max = 100)
  private String email;

  @Size(min = 8, max = 20, message = "Senha deve ter entre 8 e 20 caracteres")
  @Pattern(
      regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
      message = "Senha deve conter maiúscula, minúscula, número e caractere especial")
  private String password;

  private UserRole role;

  private LocalDate admissionDate;
}
