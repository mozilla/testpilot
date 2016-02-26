FROM python:3

EXPOSE 8000
CMD ["./bin/run-prod.sh"]

WORKDIR /app

RUN groupadd --gid 10001 app && \
    useradd --uid 10001 --gid 10001 --shell /usr/sbin/nologin app

# Install & cache dependencies for Django/Python using peep with a supported
# pinned version of pip
COPY requirements.txt /app/requirements.txt
COPY bin/peep.py /app/bin/peep.py
RUN pip install pip==6.0.0 && \
    ./bin/peep.py install -r requirements.txt

# Copy in the whole app after dependencies have been installed & cached
COPY . /app

# Collect the static assets together, with placeholder env vars
RUN SECRET_KEY=foo DEBUG=False ALLOWED_HOSTS=localhost \
    DATABASE_URL=postgres://postgres@db/postgres \
    ./manage.py collectstatic --noinput

# De-escalate from root privileges with app user
USER app
