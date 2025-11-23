package br.com.unifei.clinicproject.mappers;

import br.com.unifei.clinicproject.dtos.response.MedicalRecordResponse;
import br.com.unifei.clinicproject.entities.MedicalRecordAttachmentEntity;
import br.com.unifei.clinicproject.entities.MedicalRecordEntity;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface MedicalMapper {

  @Mapping(target = "veterinarianName", source = "veterinarian.name")
  @Mapping(target = "veterinarianId", source = "veterinarian.id")
  @Mapping(target = "tutorId", source = "pet.tutor.id")
  @Mapping(target = "petId", source = "pet.id")
  @Mapping(target = "attachmentPaths", source = "attachments")
  MedicalRecordResponse toResponseDto(MedicalRecordEntity entity);

  default List<String> mapAttachments(List<MedicalRecordAttachmentEntity> attachments) {
    if (attachments == null) return null;
    return attachments.stream().map(MedicalRecordAttachmentEntity::getFilePath).toList();
  }

  List<MedicalRecordResponse> toResponseDto(List<MedicalRecordEntity> medicalRecordEntity);
}
