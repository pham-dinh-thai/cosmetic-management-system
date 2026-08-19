#!/bin/sh
set -e
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -c "CREATE DATABASE cosmetic_authentication_service;"
