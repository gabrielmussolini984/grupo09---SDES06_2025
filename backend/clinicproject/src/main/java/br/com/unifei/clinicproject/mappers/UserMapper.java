package br.com.unifei.clinicproject.mappers;

import br.com.unifei.clinicproject.dtos.request.UserRequest;
import br.com.unifei.clinicproject.dtos.response.UserResponse;
import br.com.unifei.clinicproject.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

  @Mapping(target = "id", ignore = true)
  UserEntity toEntity(UserRequest dto);

  UserResponse toResponseDTO(UserEntity entity);
}
