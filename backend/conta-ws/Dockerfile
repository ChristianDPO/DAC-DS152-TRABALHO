FROM adoptopenjdk/openjdk11:latest
VOLUME /tmp
COPY target/conta-ws-*.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-jar","/app.jar"]