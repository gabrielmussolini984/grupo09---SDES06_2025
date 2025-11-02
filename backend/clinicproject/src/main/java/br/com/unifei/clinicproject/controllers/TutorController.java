package br.com.unifei.clinicproject.controllers;

import br.com.unifei.clinicproject.dtos.request.TutorFilterRequest;
import br.com.unifei.clinicproject.dtos.request.TutorRequest;
import br.com.unifei.clinicproject.dtos.request.TutorUpdateRequest;
import br.com.unifei.clinicproject.dtos.response.TutorResponse;
import br.com.unifei.clinicproject.entities.TutorEntity;
import br.com.unifei.clinicproject.services.TutorService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/tutors")
@Tag(name = "Tutor Controller")
public class TutorController {

  private final TutorService tutorService;

  @PostMapping
  public ResponseEntity<?> registerTutor(@RequestBody @Valid TutorRequest request) {

    tutorService.registerTutor(request);

    return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
  }

  @GetMapping("/search")
  public List<TutorResponse> searchTutors(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String cpf,
      @RequestParam(required = false) String email,
      @RequestParam(required = false) String phone,
      @Parameter(name = "orderBy", schema = @Schema(allowableValues = {"name"}))
          @RequestParam(defaultValue = "name")
          String orderBy) {
    var filter = new TutorFilterRequest();
    filter.setName(name);
    filter.setCpf(cpf);
    filter.setEmail(email);
    filter.setPhone(phone);

    return tutorService.findByFilters(filter, orderBy);
  }

  @PutMapping("/{id}")
  public TutorEntity updateTutor(
      @PathVariable String id,
      @RequestBody @Valid TutorUpdateRequest dto,
      @Parameter(description = "ID do administrador responsável pela edição") @RequestParam
          String adminId) {
    return tutorService.updateTutor(id, dto, adminId);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTutor(@PathVariable String id) {

    tutorService.deleteTutor(id);
    return ResponseEntity.noContent().build();
  }
}
