package br.com.unifei.clinicproject.services;

import br.com.unifei.clinicproject.dtos.request.TutorFilterRequest;
import br.com.unifei.clinicproject.dtos.request.TutorRequest;
import br.com.unifei.clinicproject.dtos.response.TutorResponse;
import br.com.unifei.clinicproject.entities.TutorEntity;
import br.com.unifei.clinicproject.enums.UserRole;
import br.com.unifei.clinicproject.mappers.TutorMapper;
import br.com.unifei.clinicproject.repositories.TutorRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
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
    user.setRole(UserRole.TUTOR);

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
}
