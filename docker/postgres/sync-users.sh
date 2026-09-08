#!/bin/sh
set -e
export PGPASSWORD="$POSTGRES_PASSWORD"

echo "Waiting for postgres..."
until pg_isready -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q; do
  sleep 1
done

sync_service() {
  db="$1"
  user="$2"
  password="$3"

  psql -h "$POSTGRES_HOST" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-SQL
    DO \$\$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${user}') THEN
        CREATE USER "${user}" WITH PASSWORD '${password}';
      ELSE
        ALTER USER "${user}" WITH PASSWORD '${password}';
      END IF;
    END
    \$\$;
SQL

  psql -h "$POSTGRES_HOST" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-SQL
    SELECT 'CREATE DATABASE "${db}" OWNER "${user}"'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${db}')\gexec
SQL

  psql -h "$POSTGRES_HOST" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$db" <<-SQL
    GRANT ALL PRIVILEGES ON DATABASE "${db}" TO "${user}";
    GRANT ALL PRIVILEGES ON SCHEMA public TO "${user}";
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${user}";
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "${user}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${user}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "${user}";
SQL

  echo "Synced ${db} (${user})."
}

sync_service "$USER_DB_NAME" "$USER_DB_USER" "$USER_DB_PASSWORD"
sync_service "$AUTH_DB_NAME" "$AUTH_DB_USER" "$AUTH_DB_PASSWORD"
sync_service "$AUTHORIZATION_DB_NAME" "$AUTHORIZATION_DB_USER" "$AUTHORIZATION_DB_PASSWORD"
sync_service "$DEPARTMENT_DB_NAME" "$DEPARTMENT_DB_USER" "$DEPARTMENT_DB_PASSWORD"
sync_service "$EMPLOYEE_DB_NAME" "$EMPLOYEE_DB_USER" "$EMPLOYEE_DB_PASSWORD"
sync_service "$CUSTOMER_DB_NAME" "$CUSTOMER_DB_USER" "$CUSTOMER_DB_PASSWORD"
sync_service "$CATEGORY_DB_NAME" "$CATEGORY_DB_USER" "$CATEGORY_DB_PASSWORD"
sync_service "$SUPPLIER_DB_NAME" "$SUPPLIER_DB_USER" "$SUPPLIER_DB_PASSWORD"
sync_service "$COSMETIC_DB_NAME" "$COSMETIC_DB_USER" "$COSMETIC_DB_PASSWORD"
sync_service "$INVENTORY_DB_NAME" "$INVENTORY_DB_USER" "$INVENTORY_DB_PASSWORD"
sync_service "$PURCHASE_DB_NAME" "$PURCHASE_DB_USER" "$PURCHASE_DB_PASSWORD"
sync_service "$ORDER_DB_NAME" "$ORDER_DB_USER" "$ORDER_DB_PASSWORD"
sync_service "$INVOICE_DB_NAME" "$INVOICE_DB_USER" "$INVOICE_DB_PASSWORD"

echo "Users synced."