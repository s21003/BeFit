FROM openjdk:21-jdk-slim

ENV JAVA_OPTS="-Djava.net.preferIPv4Stack=true"

COPY target/backend-postgresql-*.jar /app/app.jar

WORKDIR /app

EXPOSE 8080

CMD ["java", "-jar", "app.jar", "$JAVA_OPTS"]