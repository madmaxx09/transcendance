#!/bin/sh

# Wait until the Postgres service is ready
sleep 5

# Apply migration
python manage.py makemigrations
python manage.py migrate

# Create super user if necessary
python manage.py createsuperuser --noinput --username admin --email admin@example.com || true

# Recover static files
python manage.py collectstatic --noinput

# Starting the Django server
exec python manage.py runsslserver --certificate /code/openssl/cert.pem --key /code/openssl/key.pem 0.0.0.0:8000
