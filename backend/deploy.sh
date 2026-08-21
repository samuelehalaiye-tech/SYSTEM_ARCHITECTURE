#!/usr/bin/env bash
set -e
# Wrapper to support Render Start Command when repo backend is nested under Documents/
if [ -f "./Documents/REIKEKE2/backend/deploy.sh" ]; then
  exec bash ./Documents/REIKEKE2/backend/deploy.sh
fi

# Fallback: assume a top-level backend/ directory exists
cd backend || { echo "backend directory not found"; exit 1; }
python manage.py migrate --noinput
exec daphne backend.asgi:application --port "$PORT" --bind 0.0.0.0
