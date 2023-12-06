#!/bin/sh

set -e

echo "run db migration"
source /app/app.env
/app/migrate -path /app/migration -database "postgresql://postgres:97WrRt24M9t6Xdk6HM8F@chaosrealm.cncuqd55amtx.us-east-2.rds.amazonaws.com:5432/chaosrealm_postgres" -verbose up

echo "start the app"
exec "$@"