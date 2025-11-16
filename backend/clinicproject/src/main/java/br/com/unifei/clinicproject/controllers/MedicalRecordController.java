package br.com.unifei.clinicproject.controllers;

import br.com.unifei.clinicproject.dtos.request.MedicalRecordRequest;
import br.com.unifei.clinicproject.dtos.request.MedicalRecordUpdateRequest;
import br.com.unifei.clinicproject.dtos.response.MedicalRecordResponse;
import br.com.unifei.clinicproject.services.MedicalRecordService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/medical-records")
@RequiredArgsConstructor
@Tag(name = "Medical Record Controller")
public class MedicalRecordController {

  private final MedicalRecordService medicalRecordService;

  @ApiResponses(
      value = {@ApiResponse(responseCode = "200", description = "Medical record created")})
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> createRecord(
      @Parameter(
              name = "data",
              description = "JSON com os dados do prontuário",
              required = true,
              content =
                  @Content(
                      mediaType = MediaType.APPLICATION_JSON_VALUE,
                      schema = @Schema(implementation = MedicalRecordRequest.class)))
          @RequestPart("data")
          @Valid
          MedicalRecordRequest dto,
      @Parameter(description = "Arquivos anexados (opcional)")
          @RequestPart(value = "files", required = false)
          List<MultipartFile> files)
      throws IllegalAccessException {

    medicalRecordService.createRecord(dto, files);

    return new ResponseEntity<>("Medical record registered successfully!", HttpStatus.CREATED);
  }

  @GetMapping("/search")
  public ResponseEntity<List<MedicalRecordResponse>> searchRecords(
      @RequestParam String petId,
      @RequestParam(required = false) LocalDate startDate,
      @RequestParam(required = false) LocalDate endDate,
      @RequestParam(required = false) String veterinarianId,
      @RequestParam(required = false) String diagnosisKeyword) {

    List<MedicalRecordResponse> result =
        medicalRecordService.search(petId, startDate, endDate, veterinarianId, diagnosisKeyword);
    return ResponseEntity.ok(result);
  }

  @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> updateRecord(
      @PathVariable String id,
      @RequestPart("data") MedicalRecordUpdateRequest dto,
      @RequestPart(value = "files", required = false) List<MultipartFile> files,
      @RequestHeader(value = "veterinarianId", required = false) String veterinarianId)
      throws Exception {

    medicalRecordService.updateRecord(id, dto, files, veterinarianId);

    return ResponseEntity.ok("Medical record updated successfully!");
  }
}
