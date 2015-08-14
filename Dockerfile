FROM python:3-slim

EXPOSE 8000
CMD ["./bin/run-prod.sh"]

RUN adduser --uid 1000 --disabled-password --gecos '' --no-create-home webdev

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential python-dev libpq-dev postgresql-client gettext libyaml-dev pandoc nodejs && \
    rm -rf /var/lib/apt/lists/*

# Using PIL or Pillow? You probably want to uncomment next line
RUN apt-get update && apt-get install -y --no-install-recommends libjpeg62-turbo-dev

WORKDIR /app

# Pin a known to work with peep pip version.
RUN pip install pip==6.0.0

# First copy requirements.txt and peep so we can take advantage of
# docker caching.
COPY ./bin/peep.py /app/bin/peep.py
COPY requirements.txt /app/requirements.txt
RUN ./bin/peep.py install -r requirements.txt

RUN apt-get install -y --no-install-recommends nodejs-legacy npm
COPY package.json /app/package.json
RUN npm install

COPY . /app
RUN DEBUG=False SECRET_KEY=foo ALLOWED_HOSTS=localhost, DATABASE_URL= ./manage.py collectstatic --noinput -c
RUN chown webdev.webdev -R .
USER webdev
