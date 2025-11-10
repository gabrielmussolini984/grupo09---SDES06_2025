package br.com.unifei.clinicproject.mappers;

import br.com.unifei.clinicproject.dtos.response.PetResponse;
import br.com.unifei.clinicproject.entities.PetEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDate;
import java.time.Period;

@Mapper(componentModel = "spring")
public interface PetMapper {

  @Mapping(target = "age", expression = "java(calculateAge(pet.getBirthDate()))")
  @Mapping(target = "tutorName", source = "pet.tutor.name")
  @Mapping(target = "tutorCpf", source = "pet.tutor.cpf")
  PetResponse toResponseDto(PetEntity pet);

  default Integer calculateAge(LocalDate birthDate) {
    return (birthDate == null) ? null : Period.between(birthDate, LocalDate.now()).getYears();
  }
}
