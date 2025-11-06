package br.com.unifei.clinicproject.mappers;

import br.com.unifei.clinicproject.dtos.request.UserRequest;
import br.com.unifei.clinicproject.dtos.request.UserUpdateRequest;
import br.com.unifei.clinicproject.dtos.response.UserResponse;
import br.com.unifei.clinicproject.entities.UserEntity;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

  @Mapping(target = "id", ignore = true)
  UserEntity toEntity(UserRequest dto);

  UserResponse toResponseDTO(UserEntity entity);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void updateEntityFromDto(UserUpdateRequest dto, @MappingTarget UserEntity entity);
}
