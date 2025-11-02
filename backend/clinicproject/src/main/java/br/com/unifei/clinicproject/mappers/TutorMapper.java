package br.com.unifei.clinicproject.mappers;

import br.com.unifei.clinicproject.dtos.request.TutorRequest;
import br.com.unifei.clinicproject.dtos.response.TutorResponse;
import br.com.unifei.clinicproject.entities.TutorEntity;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TutorMapper {

  TutorMapper INSTANCE = Mappers.getMapper(TutorMapper.class);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "active", ignore = true)
  TutorEntity toEntity(TutorRequest dto);

  TutorResponse toResponseDTO(TutorEntity entity);
}
