# Etapa 1: build da aplicação
FROM gradle:8.10-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle clean bootJar --no-daemon

# Etapa 2: imagem de execução
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copia o .jar gerado pelo Gradle
COPY --from=builder /app/build/libs/*.jar app.jar

# Expõe a porta da aplicação e do H2 Console
EXPOSE 8080
EXPOSE 8081

# Executa a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
