CREATE TABLE IF NOT EXISTS tb_conta
(
    id_conta                  SERIAL PRIMARY KEY       NOT NULL,
    id_cliente                BIGINT                   NOT NULL UNIQUE,
    data_hora_abertura        TIMESTAMPTZ              DEFAULT CURRENT_TIMESTAMP,
    saldo                     FLOAT                    NOT NULL,
    limite                    FLOAT                    NOT NULL        
);

CREATE TABLE IF NOT EXISTS tb_movimentacao
(
    id_movimentacao         SERIAL PRIMARY KEY       NOT NULL,
    id_conta                BIGINT                   NOT NULL,
    id_conta_origem         BIGINT                   NOT NULL,
    id_conta_destino        BIGINT                   NULL,
    tipo                    VARCHAR(3)               NOT NULL,
    data_hora               TIMESTAMPTZ              DEFAULT CURRENT_TIMESTAMP,
    valor                   FLOAT                    NOT NULL, 
    saldo_apos              FLOAT                    NOT NULL, 

    CONSTRAINT fk_conta_origem
        FOREIGN KEY ( id_conta_origem ) 
        REFERENCES tb_conta ( id_conta ),
    CONSTRAINT fk_conta_destino
        FOREIGN KEY ( id_conta_destino ) 
        REFERENCES tb_conta ( id_conta ),
    CONSTRAINT val_tipo_movimentacao 
        CHECK (tipo in ('dep','saq','tra'))
);