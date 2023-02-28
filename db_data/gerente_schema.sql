CREATE TABLE IF NOT EXISTS tb_gerente
(
    id_gerente              SERIAL PRIMARY KEY       NOT NULL,
    nome                    VARCHAR(128)             NOT NULL, 
    email                   VARCHAR(128)             NOT NULL UNIQUE,    
    cpf                     VARCHAR(11)              NOT NULL UNIQUE,
    num_clientes            INT                      NOT NULL DEFAULT 0
);