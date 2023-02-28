# Trabalho da Disciplina de DS152

__Disciplina:__ Desenvolvimento de Aplicações Corporativas - DAC (DS152)

__Curso:__ Tecnologia em Análise e Desenvolvimento de Sistemas - Universidade Federal do Paraná (UFPR)

__Professor:__ Razer Anthom Nizer Rojas Montaño

__Participantes:__

* [Christian Debovi Paim Oliveira](https://github.com/ChristianDPO)
* [Eduarda Fernandes Alves da Costa](https://github.com/EduardaFACosta)
* [Maria Eduarda Franke Grácia Pereira](https://github.com/dudafranke)

# Descrição 

Consiste num sistema bancário completo chamado BANTADS (site que permite fazer transações, depositos, saques, cadastros de funcionarios e gerentes). 
A implementação foi feita em Angular (Frontend) e SpringBoot (Backend) PostgresSQL (Banco de Dados). Todo o sistema (com exceção do frontend)
foi conteinerizado em containers/volumes em Docker. Foram utilizado padrões de projeto como: Microsserviços, com comunicação por fila assíncrona através de RabbitMQ, 
API-gateway (feito em Node.js) e CQRS. Uma descrição detalhada do projeto pode ser encontrada no pdf `projeto.pdf` e o relatório/divisão das atividades em `relatorio_de_atividades.pfd`

# Dependências

As seguintes instalações são necessárias:
## Docker
- Docker: https://docs.docker.com/get-docker/
- Docker Compose: https://docs.docker.com/compose/install/
- No Windowns, basta baixar o Docker Desktop, que ja vem com o Docker Compose
## Maven
- Para construir e rodar as imagens dos microsserviços em Spring Boot
- No Linux:
    ```
    sudo apt-get install maven
    ```
- No Windows: 
    - Seguir este video: https://youtu.be/-ucX5w8Zm8s

# Rodando

- Para iniciar o sistema basta executar os comandos abaixo na ordem, no diretório atual
    1. __(NO WINDOWS)__ Abrir o Docker Desktop, verificar se ele iniciou antes de começar.
    2. Executar os comandos para montar as imagens dos microsserviços (pode-se tanto executar direto na pasta de cada microsserviço o comando `mvn spring-boot:build-image` ou usar os comandos abaixo)
    ```
    mvn spring-boot:build-image -f backend/auth-ws/pom.xml
    mvn spring-boot:build-image -f backend/cliente-ws/pom.xml
    mvn spring-boot:build-image -f backend/gerente-ws/pom.xml
    mvn spring-boot:build-image -f backend/conta-ws/pom.xml
    mvn spring-boot:build-image -f backend/orquestrador-ws/pom.xml
    ```
    3. Executar o montar as imagens do banco de dados (também copia os códigos dos microsserviços para suas imagens)
    ```
    docker-compose -f docker/docker-compose.yml build
    ```
    4. Executar o comando para iniciar a execução das imagens docker(verifique se não há nenhum erro nos logs):
    ```
    docker-compose -f docker/docker-compose.yml up
    ```
    5. Para parar a execução, basta pressionar `Ctrl + C`, depois executar o comando para parar remover os serviços:
    ```
    docker-compose -f docker/docker-compose.yml down
    ```


# Observações (para desenvolvedores)

- É possível buildar/rodar apenas containeres específicos os especificando no final do comando docker-compose. Por exemplo, para buildar/rodar apenas o serviço/banco de dados de autenticação e o api-gateway:
```
docker-compose build authentication-postgres authentication-service api-gateway
docker-compose up authentication-postgres authentication-service api-gateway
```
- Para conectar no pgadmin, basta acessar `http://localhost:15432/` usando:
    - login: postgres@gmail.com 
    - senha: postgres123
- Os bancos de dados são armazenados em volumes docker (como uma pasta interna ao docker), um para cada banco de dados do microsserviço
- Cada vez que algo do código do backend ou dos SQLs dos bancos de dados sejam mudados, é necessario dar build novamente, pois o docker precisa copiar as alterações feitas para as imagens.

### Mudei o SQL do banco de dados
- Caso seja mudado algo no banco de dados (por exemplo, adição de um campo/coluna numa tabela), para as mudanças serem aplicadas, deve-se:
    1. Remover o volume docker do banco alterado (o banco não é criado novamente se ele já existe, então os volumes devem ser removidos em qualquer alteração):
    ```
    docker volume rm authentication_db
    docker volume rm cliente_db
    docker volume rm gerente_db
    docker volume rm conta_cud_db
    docker volume rm conta_read_db
    ```
    2. Parar os containers se eles estiverem rodando
    ```
    docker-compose -f docker/docker-compose.yml down
    ```
    3. Executar o `build` e o `up` novamente:
    ```
    docker-compose -f docker/docker-compose.yml build
    docker-compose -f docker/docker-compose.yml up
    ```

### Mudei o código dos microsserviços e quero testar no docker
- Caso os microsserviços sejam mudados, temos que dar build nas imagens deles novamente. Por exemplo, se foi alterado o serviço `auth-ws`, deve-se:
    1. Dar build na imagem do microsserviço mudado:
    ```
    mvn spring-boot:build-image -f backend/auth-ws/pom.xml
    ```
    2. Para os containers se eles estiverem rodando
    ```
    docker-compose -f docker/docker-compose.yml down
    ```
    3. Executar o `build` e o `up` novamente:
    ```
    docker-compose -f docker/docker-compose.yml build
    docker-compose -f docker/docker-compose.yml up
    ```

### Mudei o API Gateway
- Basta dar build novamente que o código será atualizado na imagem:
    1. Para os containers se eles estiverem rodando
    ```
    docker-compose -f docker/docker-compose.yml down
    ```
    2. Executar o `build` e o `up` novamente:
    ```
    docker-compose -f docker/docker-compose.yml build
    docker-compose -f docker/docker-compose.yml up
    ```

