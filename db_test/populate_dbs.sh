#!/bin/bash
# Executar quando o backend estiver rodando
cat ./populate_auth.sql | docker exec -i authentication-postgres psql -U postgres -d authentication
cat ./populate_clientes.sql | docker exec -i cliente-postgres psql -U postgres -d cliente
cat ./populate_gerentes.sql | docker exec -i gerente-postgres psql -U postgres -d gerente
cat ./populate_contas.sql | docker exec -i conta-read-postgres psql -U postgres -d conta_read
cat ./populate_contas.sql | docker exec -i conta-cud-postgres psql -U postgres -d conta_cud