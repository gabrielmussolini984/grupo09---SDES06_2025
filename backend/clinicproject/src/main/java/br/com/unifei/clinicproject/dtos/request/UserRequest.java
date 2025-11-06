package br.com.unifei.clinicproject.dtos.request;

import br.com.unifei.clinicproject.enums.UserRole;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record UserRequest(
    @NotBlank(message = "Nome completo é obrigatório") @Size(max = 150) String name,
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos numéricos") String cpf,
    @Email(message = "E-mail inválido") @Size(max = 100) String email,
    @Pattern(regexp = "\\d{10,15}", message = "Telefone deve conter de 10 a 15 dígitos numéricos")
        String phone,
    @NotNull(message = "Cargo/Role é obrigatório") UserRole role,
    @NotNull(message = "Data de admissão é obrigatória") LocalDate admissionDate,
    @NotBlank(message = "Login é obrigatório") @Size(max = 30) String username,
    @NotBlank(message = "Senha é obrigatória")
        @Size(min = 8, max = 20, message = "Senha deve ter entre 8 e 20 caracteres")
        @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
            message = "Senha deve conter maiúscula, minúscula, número e caractere especial")
        String password) {}
