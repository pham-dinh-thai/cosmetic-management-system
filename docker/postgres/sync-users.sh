#!/bin/sh
set -e
export PGPASSWORD="$POSTGRES_PASSWORD"

echo "Waiting for postgres..."
until pg_isready -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q; do
  sleep 1
done

psql -h "$POSTGRES_HOST" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-SQL
  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'cosmetic_user') THEN
      CREATE USER cosmetic_user WITH PASSWORD '${USER_DB_PASSWORD}';
    ELSE
      ALTER USER cosmetic_user WITH PASSWORD '${USER_DB_PASSWORD}';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'cosmetic_auth') THEN
      CREATE USER cosmetic_auth WITH PASSWORD '${AUTH_DB_PASSWORD}';
    ELSE
      ALTER USER cosmetic_auth WITH PASSWORD '${AUTH_DB_PASSWORD}';
    END IF;
  END
  \$\$;
SQL

psql -h "$POSTGRES_HOST" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d cosmetic_user_service <<-SQL
  GRANT ALL PRIVILEGES ON DATABASE cosmetic_user_service TO cosmetic_user;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cosmetic_user;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cosmetic_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_user;
SQL

psql -h "$POSTGRES_HOST" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d cosmetic_authentication_service <<-SQL
  GRANT ALL PRIVILEGES ON DATABASE cosmetic_authentication_service TO cosmetic_auth;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cosmetic_auth;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cosmetic_auth;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_auth;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_auth;
SQL

echo "Users synced."
