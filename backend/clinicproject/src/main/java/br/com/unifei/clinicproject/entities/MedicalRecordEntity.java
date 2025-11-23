package br.com.unifei.clinicproject.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "MEDICAL_RECORDS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordEntity {

  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  @Column(name = "ID")
  private String id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "PET_ID")
  private PetEntity pet;

  @ManyToOne(optional = false)
  @JoinColumn(name = "VETERINARIAN_ID")
  private UserEntity veterinarian;

  @Column(name = "CONSULTATION_DATE", nullable = false)
  private LocalDate consultationDate;

  @Column(name = "DIAGNOSIS", nullable = false, length = 1000)
  private String diagnosis;

  @Column(name = "PRESCRIPTION", nullable = false, length = 1000)
  private String prescription;

  @Column(name = "NOTES", length = 1000)
  private String notes;

  @Builder.Default
  @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<MedicalRecordAttachmentEntity> attachments = new ArrayList<>();

  @Column(name = "LAST_MODIFIED_DATE")
  private OffsetDateTime lastModifiedDate;

  @Column(name = "LAST_MODIFIED_BY")
  private String lastModifiedBy;
}
