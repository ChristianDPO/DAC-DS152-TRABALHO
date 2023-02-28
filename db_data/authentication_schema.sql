CREATE TABLE IF NOT EXISTS tb_autenticacao
(
    id_usuario             SERIAL PRIMARY KEY       NOT NULL,
    login                  VARCHAR(128)             NOT NULL UNIQUE, 
    senha                  VARCHAR(128)             NOT NULL,
    perfil                 VARCHAR(3)               NOT NULL       

    CONSTRAINT val_perfil 
        CHECK (perfil in ('ADM','GER','CLI'))
);