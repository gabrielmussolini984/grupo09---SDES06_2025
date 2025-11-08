package br.com.unifei.clinicproject.controllers;

import br.com.unifei.clinicproject.dtos.request.PetCreateRequest;
import br.com.unifei.clinicproject.dtos.response.PetResponse;
import br.com.unifei.clinicproject.services.PetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/pets")
@Tag(name = "Pet Controller")
public class PetController {

  private final PetService petService;

  @PostMapping("/{tutorId}")
  @Operation(summary = "Register a new pet")
  public ResponseEntity<?> createPet(
      @RequestBody PetCreateRequest request, @PathVariable String tutorId) {

    petService.createPet(request, tutorId);
    return new ResponseEntity<>("Pet registered successfully!", HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<List<PetResponse>> searchPets(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String species,
      @RequestParam(required = false) String breed,
      @RequestParam(required = false) String ownerName,
      @RequestParam(required = false) String ownerCpf,
      @Parameter(name = "orderBy", schema = @Schema(allowableValues = {"name", "owner"}))
          @RequestParam(required = false, defaultValue = "name")
          String sortBy) {

    List<PetResponse> result =
        petService.findPets(name, species, breed, ownerName, ownerCpf, sortBy);
    return ResponseEntity.ok(result);
  }
}
