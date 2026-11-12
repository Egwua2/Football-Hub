FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Convert Render's PostgreSQL URL to the JDBC form required by Spring Boot.
CMD ["sh", "-c", "if [ -n \"${DATABASE_URL:-}\" ]; then case \"$DATABASE_URL\" in postgres://*|postgresql://*) export SPRING_DATASOURCE_URL=\"jdbc:${DATABASE_URL}\" ;; esac; fi; exec java -Xmx400m -jar app.jar --server.port=${PORT:-8080}"]
