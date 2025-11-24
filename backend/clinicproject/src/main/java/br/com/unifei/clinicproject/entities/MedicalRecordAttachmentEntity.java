package br.com.unifei.clinicproject.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "MEDICAL_RECORD_ATTACHMENTS")
public class MedicalRecordAttachmentEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  private String fileName;

  private String filePath;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "MEDICAL_RECORD_ID")
  private MedicalRecordEntity medicalRecord;
}
