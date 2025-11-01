package br.com.unifei.clinicproject.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
  @Bean
  public OpenAPI productOpenAPI() {
    return new OpenAPI().info(metaData());
  }

  private Info metaData() {
    return new Info()
        .title("API de Gerenciamento Para Clínicas Veterinárias E Petshops")
        .description("Documentação da API referente ao trabalho final para a disciplina SDES06.")
        .license(
            new License()
                .name("Instituto de Matemática e Computação - Universidade Federal de Itajubá")
                .url("https://unifei.edu.br/"));
  }
}
