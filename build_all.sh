#!/bin/bash
mvn spring-boot:build-image -f backend/auth-ws/pom.xml
mvn spring-boot:build-image -f backend/cliente-ws/pom.xml
mvn spring-boot:build-image -f backend/gerente-ws/pom.xml
mvn spring-boot:build-image -f backend/conta-ws/pom.xml
mvn spring-boot:build-image -f backend/orquestrador-ws/pom.xml
docker-compose -f docker/docker-compose.yml build