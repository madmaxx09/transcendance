FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && apt-get install -y \
	gcc \
	python3-dev \
	build-essential \
	--no-install-recommends && \
	rm -rf /var/lib/apt/lists/*

RUN pip install -r requirements.txt

COPY . .

# Copy entrypoint script
COPY /tools/entrypoint.sh ../usr/local/bin/

COPY media/images media/images

# Set script execution permissions
RUN chmod +x ../usr/local/bin/entrypoint.sh

# Run initialization script
ENTRYPOINT ["bash", "-c", "exec ../usr/local/bin/entrypoint.sh"]
