package br.com.unifei.clinicproject.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "PETS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetEntity {

  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  @Column(name = "ID")
  private String id;

  @Column(name = "NAME", nullable = false, length = 100)
  private String name;

  @Column(name = "SPECIES", nullable = false, length = 50)
  private String species;

  @Column(name = "BREED", nullable = false, length = 100)
  private String breed;

  @Column(name = "SEX", nullable = false, length = 15)
  private String sex;

  @Column(name = "BIRTH_DATE", nullable = false)
  private LocalDate birthDate;

  @Column(name = "COLOR", nullable = false, length = 50)
  private String color;

  @Column(name = "WEIGHT", nullable = false)
  private Double weight;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TUTOR_ID", nullable = false)
  private TutorEntity tutor;

  @Column(name = "NOTES", length = 500)
  private String notes;

  @Builder.Default
  @Column(name = "CREATED_DATE")
  private OffsetDateTime createdDate = OffsetDateTime.now();
}
