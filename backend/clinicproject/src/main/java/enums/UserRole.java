package enums;

import java.util.Arrays;

public enum UserRole {
  ATENDENTE,
  VETERINARIO,
  ADMINISTRADOR;

  public static String[] toArray() {
    return Arrays.stream(UserRole.values()).map(Enum::toString).toArray(String[]::new);
  }
}
