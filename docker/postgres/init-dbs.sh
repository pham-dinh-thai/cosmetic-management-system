#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-SQL
  CREATE USER cosmetic_user WITH PASSWORD '${USER_DB_PASSWORD}';
  CREATE USER cosmetic_auth  WITH PASSWORD '${AUTH_DB_PASSWORD}';
  CREATE USER cosmetic_authorization WITH PASSWORD '${AUTHORIZATION_DB_PASSWORD}';
  CREATE USER cosmetic_department WITH PASSWORD '${DEPARTMENT_DB_PASSWORD}';
  CREATE USER cosmetic_employee WITH PASSWORD '${EMPLOYEE_DB_PASSWORD}';

  GRANT ALL PRIVILEGES ON DATABASE cosmetic_user_service TO cosmetic_user;
  GRANT ALL PRIVILEGES ON SCHEMA public TO cosmetic_user;

  CREATE DATABASE cosmetic_department_service OWNER cosmetic_department;
  GRANT ALL PRIVILEGES ON DATABASE cosmetic_department_service TO cosmetic_department;

  CREATE DATABASE cosmetic_authentication_service OWNER cosmetic_auth;
  GRANT ALL PRIVILEGES ON DATABASE cosmetic_authentication_service TO cosmetic_auth;

  CREATE DATABASE cosmetic_authorization_service OWNER cosmetic_authorization;
  GRANT ALL PRIVILEGES ON DATABASE cosmetic_authorization_service TO cosmetic_authorization;

  CREATE DATABASE cosmetic_employee_service OWNER cosmetic_employee;
  GRANT ALL PRIVILEGES ON DATABASE cosmetic_employee_service TO cosmetic_employee;
SQL

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d cosmetic_user_service <<-SQL
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cosmetic_user;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cosmetic_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_user;
SQL

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d cosmetic_authentication_service <<-SQL
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cosmetic_auth;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cosmetic_auth;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_auth;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_auth;
SQL

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d cosmetic_authorization_service <<-SQL
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cosmetic_authorization;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cosmetic_authorization;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_authorization;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_authorization;
SQL

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d cosmetic_department_service <<-SQL
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cosmetic_department;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cosmetic_department;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_department;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_department;
SQL

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d cosmetic_employee_service <<-SQL
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cosmetic_employee;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cosmetic_employee;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cosmetic_employee;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cosmetic_employee;
SQL