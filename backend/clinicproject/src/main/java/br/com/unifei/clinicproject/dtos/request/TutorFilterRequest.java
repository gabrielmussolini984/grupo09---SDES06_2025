package br.com.unifei.clinicproject.dtos.request;

import lombok.Data;

@Data
public class TutorFilterRequest {
  private String name;
  private String cpf;
  private String email;
  private String phone;
}
