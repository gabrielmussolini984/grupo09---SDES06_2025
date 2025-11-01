package br.com.unifei.clinicproject.services;

import br.com.unifei.clinicproject.dtos.request.UserFilterRequest;
import br.com.unifei.clinicproject.dtos.request.UserRequest;
import br.com.unifei.clinicproject.dtos.response.UserResponse;
import br.com.unifei.clinicproject.entities.UserEntity;
import br.com.unifei.clinicproject.mappers.UserMapper;
import br.com.unifei.clinicproject.repositories.UserRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserMapper mapper;
  private final UserRepository repository;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public void createUser(UserRequest userRequest) {
    repository
        .findByCpf(userRequest.cpf())
        .ifPresent(
            u -> {
              throw new IllegalArgumentException("CPF já cadastrado.");
            });
    repository
        .findByEmail(userRequest.email())
        .ifPresent(
            u -> {
              throw new IllegalArgumentException("E-mail já cadastrado.");
            });
    repository
        .findByUsername(userRequest.username())
        .ifPresent(
            u -> {
              throw new IllegalArgumentException("Usuário já cadastrado.");
            });

    if (userRequest.admissionDate().isAfter(LocalDate.now())) {
      throw new IllegalArgumentException("Data de admissão não pode ser futura.");
    }

    UserEntity user = mapper.toEntity(userRequest);
    user.setPassword(encoder.encode(userRequest.password()));

    UserEntity saved = repository.save(user);

    sendEmailNotification(saved);
  }

  private void sendEmailNotification(UserEntity user) {
    System.out.println(
        "📧 Email enviado para " + user.getEmail() + ": Usuário cadastrado com sucesso!");
  }

  public List<UserResponse> findByFilters(UserFilterRequest filter, String orderBy) {
    Specification<UserEntity> spec =
        (root, query, cb) -> {
          List<Predicate> predicates = new ArrayList<>();

          if (filter.getName() != null && !filter.getName().isBlank()) {
            predicates.add(
                cb.like(cb.lower(root.get("name")), "%" + filter.getName().toLowerCase() + "%"));
          }

          if (filter.getCpf() != null && !filter.getCpf().isBlank()) {
            predicates.add(cb.equal(root.get("cpf"), filter.getCpf()));
          }

          if (filter.getRole() != null) {
            predicates.add(cb.equal(root.get("role"), filter.getRole()));
          }

          if (filter.getAdmissionStart() != null) {
            predicates.add(
                cb.greaterThanOrEqualTo(root.get("admissionDate"), filter.getAdmissionStart()));
          }

          if (filter.getAdmissionEnd() != null) {
            predicates.add(
                cb.lessThanOrEqualTo(root.get("admissionDate"), filter.getAdmissionEnd()));
          }

          return cb.and(predicates.toArray(new Predicate[0]));
        };

    Sort sort =
        switch (orderBy) {
          case "date" -> Sort.by("admissionDate").ascending();
          default -> Sort.by("name").ascending();
        };

    return repository.findAll(spec, sort).stream().map(mapper::toResponseDTO).toList();
  }
}
