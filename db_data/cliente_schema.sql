CREATE TABLE IF NOT EXISTS tb_endereco
(
    id_endereco             SERIAL PRIMARY KEY       NOT NULL,
    tipo                    VARCHAR(64)              NOT NULL,
    logradouro              VARCHAR(128)             NOT NULL,
    numero                  INT                      NOT NULL,
    complemento             VARCHAR(128)             NULL,
    cep                     VARCHAR(10)              NOT NULL,
    cidade                  VARCHAR(64)              NOT NULL,
    estado                  VARCHAR(64)              NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_cliente
(
    id_cliente                SERIAL PRIMARY KEY       NOT NULL,
    id_endereco               BIGINT                   NOT NULL,
    id_gerente                BIGINT                   NOT NULL,
    nome                      VARCHAR(128)             NOT NULL, 
    email                     VARCHAR(128)             NOT NULL UNIQUE,    
    cpf                       VARCHAR(11)              NOT NULL UNIQUE,
    salario                   FLOAT                    NOT NULL,
    aprovado                  BOOLEAN                  NOT NULL,

    CONSTRAINT fk_id_endereco
        FOREIGN KEY ( id_endereco ) 
        REFERENCES tb_endereco ( id_endereco )

);