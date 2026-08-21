#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
## If one branch of the conflicting migrations already created the DB columns,
## fake-apply the other migration so Django's migrate doesn't try to add them twice.
python manage.py migrate rides 0007_add_passenger_coords --fake || true
python manage.py migrate --noinput
exec daphne backend.asgi:application --port "$PORT" --bind 0.0.0.0