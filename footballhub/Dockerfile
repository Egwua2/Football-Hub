FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render supplies DATABASE_URL as a URI with credentials in its authority.
# The PostgreSQL JDBC driver expects credentials in separate datasource settings.
CMD ["sh", "-c", "if [ -n \"${DATABASE_URL:-}\" ]; then case \"$DATABASE_URL\" in postgres://*|postgresql://*) db_url=\"${DATABASE_URL#*://}\"; db_credentials=\"${db_url%%@*}\"; db_host_path=\"${db_url#*@}\"; db_username=\"${db_credentials%%:*}\"; db_password=\"${db_credentials#*:}\"; db_host=\"${db_host_path%%/*}\"; db_database=\"${db_host_path#*/}\"; db_query=\"\"; case \"$db_database\" in *\\?*) db_query=\"?${db_database#*\\?}\"; db_database=\"${db_database%%\\?*}\" ;; esac; export SPRING_DATASOURCE_URL=\"jdbc:postgresql://${db_host}/${db_database}${db_query}\"; export SPRING_DATASOURCE_USERNAME=\"$db_username\"; export SPRING_DATASOURCE_PASSWORD=\"$db_password\" ;; esac; fi; exec java -Xmx400m -jar app.jar --server.port=${PORT:-8080}"]
