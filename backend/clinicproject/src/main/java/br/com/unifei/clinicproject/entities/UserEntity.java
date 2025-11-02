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
    name = "USERS",
    uniqueConstraints = {
      @UniqueConstraint(columnNames = "CPF"),
      @UniqueConstraint(columnNames = "EMAIL"),
      @UniqueConstraint(columnNames = "USERNAME")
    })
public class UserEntity {

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

  @Enumerated(EnumType.STRING)
  @Column(name = "ROLE", nullable = false)
  private UserRole role;

  @Column(name = "ADMISSION_DATE", nullable = false)
  private LocalDate admissionDate;

  @Column(name = "USERNAME", nullable = false, length = 30, unique = true)
  private String username;

  @Column(name = "PASSWORD", nullable = false, length = 100)
  private String password;

  @Column(name = "LAST_MODIFIED_DATE")
  private OffsetDateTime lastModifiedDate;

  @Column(name = "LAST_MODIFIED_BY")
  private String lastModifiedBy;

  @Column(name = "ACTIVE", nullable = false)
  private boolean active = true;

  // todo to implement in the RELEASE 03
  //  @OneToMany(mappedBy = "funcionario")
  //  private List<Agendamento> agendamentos;
}
