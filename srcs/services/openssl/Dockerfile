FROM python:3.9-slim

WORKDIR /ssl/openssl

RUN apt-get update && apt-get install -y \
	openssl \
	&& openssl req -x509 -nodes -out cert.pem -keyout key.pem -subj "/C=BE/ST=BC/L=Bruxelles/O=19/OU=19/CN=localhost/UID=gt-serst" \
	&& chmod 644 cert.pem key.pem