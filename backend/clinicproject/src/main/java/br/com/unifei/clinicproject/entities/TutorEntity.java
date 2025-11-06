package br.com.unifei.clinicproject.entities;

import br.com.unifei.clinicproject.enums.UserRole;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(
    name = "TUTOR",
    uniqueConstraints = {
      @UniqueConstraint(columnNames = "CPF"),
      @UniqueConstraint(columnNames = "EMAIL"),
    })
public class TutorEntity {

  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  @Column(name = "USER_ID")
  private String id;

  @Column(name = "NAME", nullable = false, length = 150)
  private String name;

  @Column(name = "CPF", nullable = false, length = 11, unique = true)
  private String cpf;

  @Column(name = "EMAIL", nullable = false, length = 100, unique = true)
  private String email;

  @Column(name = "PHONE", nullable = false, length = 15)
  private String phone;

  @Column(name = "ADDRESS", nullable = false, length = 100)
  private String address;

  @Enumerated(EnumType.STRING)
  @Column(name = "ROLE", nullable = false)
  private UserRole role;

  @Column(name = "BIRTH_DATE")
  private LocalDate birthDate;

  @Column(name = "PASSWORD", nullable = false, length = 100)
  private String password;

  @Column(name = "LAST_MODIFIED_DATE")
  private OffsetDateTime lastModifiedDate;

  @Column(name = "LAST_MODIFIED_BY")
  private String lastModifiedBy;

  @Builder.Default
  @Column(name = "CREATED_DATE")
  private OffsetDateTime createdDate = OffsetDateTime.now();

  @Builder.Default
  @Column(name = "ACTIVE", nullable = false)
  private boolean active = true;
}
