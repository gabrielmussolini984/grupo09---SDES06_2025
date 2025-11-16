package br.com.unifei.clinicproject.mappers;

import br.com.unifei.clinicproject.dtos.response.MedicalRecordResponse;
import br.com.unifei.clinicproject.entities.MedicalRecordEntity;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface MedicalMapper {

  @Mappings({@Mapping(target = "veterinarianName", source = "veterinarian.name")})
  MedicalRecordResponse toResponseDto(MedicalRecordEntity entity);

  List<MedicalRecordResponse> toResponseDto(List<MedicalRecordEntity> medicalRecordEntity);
}
