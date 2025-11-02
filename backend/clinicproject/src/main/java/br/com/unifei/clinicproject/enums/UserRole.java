package br.com.unifei.clinicproject.enums;

import java.util.Arrays;

public enum UserRole {
  ATENDENTE,
  VETERINARIO,
  ADMINISTRADOR,
  TUTOR;

  public static String[] toArray() {
    return Arrays.stream(UserRole.values()).map(Enum::toString).toArray(String[]::new);
  }
}
