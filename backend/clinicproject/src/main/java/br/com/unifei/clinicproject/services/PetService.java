package br.com.unifei.clinicproject.services;

import br.com.unifei.clinicproject.dtos.request.PetCreateRequest;
import br.com.unifei.clinicproject.dtos.request.PetUpdateRequest;
import br.com.unifei.clinicproject.dtos.response.PetResponse;
import br.com.unifei.clinicproject.entities.PetEntity;
import br.com.unifei.clinicproject.entities.TutorEntity;
import br.com.unifei.clinicproject.mappers.PetMapper;
import br.com.unifei.clinicproject.repositories.PetRepository;
import br.com.unifei.clinicproject.repositories.TutorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetService {

  private final PetRepository petRepository;
  private final TutorRepository userRepository;
  private final PetMapper petMapper;

  public void createPet(PetCreateRequest request, String tutorId) {
    TutorEntity owner =
        userRepository
            .findById(tutorId)
            .orElseThrow(() -> new IllegalArgumentException("Tutor not found"));

    PetEntity pet =
        PetEntity.builder()
            .name(request.getName())
            .species(request.getSpecies())
            .breed(request.getBreed())
            .sex(request.getSex())
            .birthDate(request.getBirthDate())
            .color(request.getColor())
            .weight(request.getWeight())
            .notes(request.getNotes())
            .tutor(owner)
            .build();

    petRepository.save(pet);
  }

  public List<PetResponse> findPets(
      String name, String species, String breed, String ownerName, String ownerCpf, String sortBy) {

    Specification<PetEntity> spec =
        (root, query, cb) -> {
          List<Predicate> predicates = new ArrayList<>();

          if (name != null && !name.isBlank())
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));

          if (species != null && !species.isBlank())
            predicates.add(cb.equal(cb.lower(root.get("species")), species.toLowerCase()));

          if (breed != null && !breed.isBlank())
            predicates.add(cb.like(cb.lower(root.get("breed")), "%" + breed.toLowerCase() + "%"));

          if (ownerName != null && !ownerName.isBlank())
            predicates.add(
                cb.like(
                    cb.lower(root.join("tutor").get("name")), "%" + ownerName.toLowerCase() + "%"));

          if (ownerCpf != null && !ownerCpf.isBlank())
            predicates.add(cb.equal(root.join("tutor").get("cpf"), ownerCpf));

          return cb.and(predicates.toArray(new Predicate[0]));
        };

    Sort sort =
        switch (sortBy == null ? "name" : sortBy.toLowerCase()) {
          case "owner" -> Sort.by("owner.name").ascending();
          default -> Sort.by("name").ascending();
        };

    return petRepository.findAll(spec, sort).stream().map(petMapper::toResponseDto).toList();
  }

  public PetResponse updatePet(String id, PetUpdateRequest dto) {
    PetEntity pet =
        petRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Pet not found with id: " + id));

    if (dto.getWeight() != null) pet.setWeight(dto.getWeight());

    if (dto.getColor() != null && !dto.getColor().isBlank()) pet.setColor(dto.getColor());

    if (dto.getNotes() != null) pet.setNotes(dto.getNotes());

    PetEntity saved = petRepository.save(pet);
    return petMapper.toResponseDto(saved);
  }

  public void deletePet(String id) {
    // Only ADMINISTRATOR can delete
    //        if (!"ADMINISTRADOR".equalsIgnoreCase(requesterRole)) {
    //            throw new AccessDeniedException("Only administrators can delete pets.");
    //        }

    PetEntity pet =
        petRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Pet not found with id: " + id));

    petRepository.delete(pet);
  }
}
