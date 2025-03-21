FROM eclipse-temurin:21-jdk-alpine
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x ./mvnw
RUN ./mvnw install -DskipTests

RUN ls -la /root/.m2/repository/com/microservices/shared-models/0.0.1-SNAPSHOT/

VOLUME /root/.m2/repository

ENTRYPOINT ["tail", "-f", "/dev/null"]