package br.com.unifei.clinicproject.controllers;

import br.com.unifei.clinicproject.dtos.request.UserFilterRequest;
import br.com.unifei.clinicproject.dtos.request.UserRequest;
import br.com.unifei.clinicproject.dtos.response.UserResponse;
import br.com.unifei.clinicproject.services.UserService;
import enums.UserRole;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
@Tag(name = "User Controller")
public class UserController {

  private final UserService userService;

  @PostMapping
  public ResponseEntity<?> createUser(@RequestBody @Valid UserRequest userRequest) {

    userService.createUser(userRequest);

    return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
  }

  @GetMapping("/search")
  public List<UserResponse> searchUsers(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String cpf,
      @Parameter(
              name = "role",
              schema = @Schema(allowableValues = {"ATENDENTE", "VETERINARIO", "ADMINISTRADOR"}))
          @RequestParam(required = false)
          String role,
      @RequestParam(required = false) String admissionStart,
      @RequestParam(required = false) String admissionEnd,
      @Parameter(name = "orderBy", schema = @Schema(allowableValues = {"date", "name"}))
          @RequestParam(defaultValue = "name")
          String orderBy) {
    UserFilterRequest filter = new UserFilterRequest();
    filter.setName(name);
    filter.setCpf(cpf);

    UserRole.toArray();

    if (role != null) filter.setRole(Enum.valueOf(UserRole.class, role.toUpperCase()));
    if (admissionStart != null) filter.setAdmissionStart(LocalDate.parse(admissionStart));
    if (admissionEnd != null) filter.setAdmissionEnd(LocalDate.parse(admissionEnd));

    return userService.findByFilters(filter, orderBy);
  }
}
