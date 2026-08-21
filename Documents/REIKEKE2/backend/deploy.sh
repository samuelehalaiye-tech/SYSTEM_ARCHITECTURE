#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
python manage.py migrate --noinput
exec daphne backend.asgi:application --port "$PORT" --bind 0.0.0.0