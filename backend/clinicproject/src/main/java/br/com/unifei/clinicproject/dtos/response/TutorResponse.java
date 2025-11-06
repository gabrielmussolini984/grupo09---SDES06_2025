package br.com.unifei.clinicproject.dtos.response;

import lombok.Data;

@Data
public class TutorResponse {
  private String id;
  private String name;
  private String cpf;
  private String email;
  private String phone;
  private String address;
}
