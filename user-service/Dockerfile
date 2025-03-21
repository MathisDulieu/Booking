FROM eclipse-temurin:21-jdk-alpine
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x ./mvnw
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
COPY --from=0 /workspace/app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]