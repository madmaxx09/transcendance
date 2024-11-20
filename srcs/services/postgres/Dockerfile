FROM postgres:14

# Copy initialization scripts to specific directory
COPY tools/postgres.sh /docker-entrypoint-initdb.d/

# Default command to execute
CMD ["postgres"]
