FROM python:3-alpine

EXPOSE 8000

CMD ["./bin/run-prod.sh"]
WORKDIR /app

RUN addgroup -g 10001 app && \
    adduser -D -u 10001 -G app -h /app -s /sbin/nologin app

# required to build on alpine
# https://github.com/python-pillow/Pillow/issues/1763#issuecomment-204252397
ENV LIBRARY_PATH=/lib:/usr/lib

# Install & cache packages for alpine
RUN apk --no-cache add ca-certificates postgresql-dev build-base libjpeg-turbo-dev zlib-dev

# Install & cache dependencies for Django/Python using pip8
COPY requirements.txt /app/requirements.txt
RUN pip install pip==8.1.2 && \
    pip install --require-hashes -r requirements.txt

# Clean up some build packages after we're done with Python
RUN apk del --purge build-base gcc

# Copy in the whole app after dependencies have been installed & cached
COPY . /app

# Collect the static assets together, with placeholder env vars
RUN SECRET_KEY=foo DEBUG=False ALLOWED_HOSTS=localhost \
    DATABASE_URL=postgres://postgres@db/postgres \
    ./manage.py collectstatic --noinput

# De-escalate from root privileges with app user
USER app
