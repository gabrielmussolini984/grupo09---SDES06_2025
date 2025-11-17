package br.com.unifei.clinicproject.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Log4j2
@Service
public class FileStorageService {

  private final Path root;

  public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
    log.info("Upload directory path: {}", uploadDir);
    this.root = Paths.get(uploadDir);

    try {
      if (!Files.exists(root)) {
        Files.createDirectory(root);
      }
    } catch (IOException e) {
      throw new RuntimeException("Could not initialize storage folder!", e);
    }
  }

  public String saveFile(MultipartFile file) {
    try {
      if (file.isEmpty()) {
        return null;
      }

      String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
      Path destination = this.root.resolve(filename);

      Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

      return filename;

    } catch (Exception e) {
      throw new RuntimeException("Could not save file: " + file.getOriginalFilename(), e);
    }
  }
}
