#!/bin/bash
set -e
set -u

echo "Creating $DATABASE_NAME database"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE DATABASE $DATABASE_NAME;
	    GRANT ALL PRIVILEGES ON DATABASE $DATABASE_NAME TO $POSTGRES_USER;
EOSQL
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$DATABASE_NAME" -f /db_schemas/schema.sql