FROM python:3-slim

EXPOSE 8000
CMD ["./bin/run-prod.sh"]

RUN adduser --uid 1000 --disabled-password --gecos '' webdev

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential python-dev \
        libpq-dev postgresql-client gettext libjpeg62-turbo-dev \
        vim wget curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pin a known to work with peep pip version.
RUN pip install pip==6.0.0

# Install all the python dependencies
COPY ./bin/peep.py /app/bin/peep.py
COPY requirements.txt /app/requirements.txt
RUN ./bin/peep.py install -r requirements.txt

COPY . /app
RUN chown webdev.webdev -R . /home/webdev
USER webdev
