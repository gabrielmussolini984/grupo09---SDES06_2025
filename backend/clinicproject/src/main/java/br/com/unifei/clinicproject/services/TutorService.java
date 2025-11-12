package br.com.unifei.clinicproject.services;

import br.com.unifei.clinicproject.dtos.request.TutorFilterRequest;
import br.com.unifei.clinicproject.dtos.request.TutorRequest;
import br.com.unifei.clinicproject.dtos.request.TutorUpdateRequest;
import br.com.unifei.clinicproject.dtos.response.TutorResponse;
import br.com.unifei.clinicproject.dtos.response.UserResponse;
import br.com.unifei.clinicproject.entities.TutorEntity;
import br.com.unifei.clinicproject.entities.UserEntity;
import br.com.unifei.clinicproject.enums.UserRole;
import br.com.unifei.clinicproject.mappers.TutorMapper;
import br.com.unifei.clinicproject.repositories.TutorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TutorService {

  private final TutorMapper mapper;

  private final TutorRepository repository;

  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  @Transactional
  public void registerTutor(TutorRequest request) {

    repository
        .findByCpf(request.cpf())
        .ifPresent(
            u -> {
              throw new IllegalArgumentException("CPF já cadastrado.");
            });

    repository
        .findByEmail(request.email())
        .ifPresent(
            u -> {
              throw new IllegalArgumentException("E-mail já cadastrado.");
            });

    TutorEntity user = mapper.toEntity(request);
    user.setPassword(encoder.encode(request.password()));

    repository.save(user);
  }

  public List<TutorResponse> findByFilters(TutorFilterRequest filter, String orderBy) {
    Specification<TutorEntity> spec =
        (root, query, cb) -> {
          List<Predicate> predicates = new ArrayList<>();

          if (filter.getName() != null && !filter.getName().isBlank()) {
            predicates.add(
                cb.like(cb.lower(root.get("name")), "%" + filter.getName().toLowerCase() + "%"));
          }

          if (filter.getCpf() != null && !filter.getCpf().isBlank()) {
            predicates.add(cb.equal(root.get("cpf"), filter.getCpf()));
          }

          if (filter.getPhone() != null && !filter.getPhone().isBlank()) {
            predicates.add(cb.equal(root.get("phone"), filter.getPhone()));
          }

          if (filter.getEmail() != null && !filter.getEmail().isBlank()) {
            predicates.add(cb.equal(root.get("email"), filter.getEmail()));
          }

          return cb.and(predicates.toArray(new Predicate[0]));
        };

    // todo testar
    Sort sort =
        switch (orderBy) {
          case "name" -> Sort.by("name").ascending();
          default -> Sort.by("createdDate").descending();
        };

    return repository.findAll(spec, sort).stream().map(mapper::toResponseDTO).toList();
  }

  public TutorEntity updateTutor(String userId, TutorUpdateRequest dto, String adminId) {
    TutorEntity user =
        repository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

    if (dto.getEmail() != null && repository.existsByEmailAndIdNot(dto.getEmail(), userId)) {
      throw new IllegalArgumentException("E-mail já está em uso por outro funcionário");
    }

    mapper.updateEntityFromDto(dto, user);

    if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
      user.setPassword(encoder.encode(dto.getPassword()));
    }

    user.setLastModifiedDate(OffsetDateTime.now());
    user.setLastModifiedBy(adminId);

    return repository.save(user);
  }

  @Transactional
  public void deleteTutor(String userId) {
    TutorEntity user =
        repository
            .findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

    repository.delete(user);

    // todo RELEASE 03
    //      boolean temAgendamentosFuturos = agendamentoRepository
    //              .existsByFuncionarioIdAndDataAfter(id, LocalDate.now());

    //      if (temAgendamentosFuturos) {
    //          // apenas desativa
    //          user.setAtivo(false);
    //          user.setDataUltimaAlteracao(LocalDateTime.now());
    //          user.setResponsavelUltimaAlteracao(adminId);
    //          userRepository.save(user);
    //      } else {
    //          userRepository.delete(user);
    //      }
  }

  public TutorResponse findById(String id) {
    TutorEntity user =
        repository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Tutor not found with id: " + id));

    return mapper.toResponseDTO(user);
  }
}
