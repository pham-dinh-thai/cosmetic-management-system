#!/bin/sh
set -e
export PGPASSWORD="$POSTGRES_PASSWORD"

until pg_isready -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q; do
  sleep 1
done

q() {
  psql -h "$POSTGRES_HOST" -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$1" -t -A -c "$2"
}

if [ -n "$(q "$USER_DB_NAME" "select id from users where email = '$DEMO_ADMIN_EMAIL'")" ]; then
  echo "Admin demo '$DEMO_ADMIN_EMAIL' da ton tai - khong lam gi ca."
  exit 0
fi

DEPARTMENT_NAME=$(q "$DEPARTMENT_DB_NAME" "select name from departments where id = '$DEMO_ADMIN_DEPARTMENT_ID'")
if [ -z "$DEPARTMENT_NAME" ]; then
  echo "Khong tim thay phong ban id '$DEMO_ADMIN_DEPARTMENT_ID'."
  echo "Chay buoc nap du lieu mau (README buoc 6) truoc, hoac doi DEMO_ADMIN_DEPARTMENT_ID trong .env."
  exit 1
fi

NEXT_CODE="NV_$(printf '%05d' $(( $(q "$EMPLOYEE_DB_NAME" "select coalesce(max(substring(code from 4)::int), 0) from employees") + 1 )))"

q "$USER_DB_NAME" "
  insert into users (id, first_name, last_name, gender, email, role_id, created_at, updated_at)
  values ('$DEMO_ADMIN_USER_ID', '$DEMO_ADMIN_FIRST_NAME', '$DEMO_ADMIN_LAST_NAME', 'other', '$DEMO_ADMIN_EMAIL', 'admin', now(), now());
" > /dev/null

q "$AUTH_DB_NAME" "
  insert into auth_users (user_id, password, email_verified_at, created_at, updated_at)
  values ('$DEMO_ADMIN_USER_ID', '$DEMO_ADMIN_PASSWORD_HASH', now(), now(), now());
" > /dev/null

q "$EMPLOYEE_DB_NAME" "
  insert into employees (user_id, code, department_id, hired_at, status, position, created_at, updated_at)
  values ('$DEMO_ADMIN_USER_ID', '$NEXT_CODE', '$DEMO_ADMIN_DEPARTMENT_ID', now(), 'ACTIVE', 'manager', now(), now());
" > /dev/null

echo "Da tao admin demo:"
echo "  email    : $DEMO_ADMIN_EMAIL"
echo "  mat khau : $DEMO_ADMIN_PASSWORD"
echo "  nhan vien: $NEXT_CODE"
echo "  phong ban: $DEPARTMENT_NAME"
echo "DANG NHAP THANH CONG -> tao tai khoan rieng va xoa tai khoan nay."
