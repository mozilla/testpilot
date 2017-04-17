FROM python:3

EXPOSE 8000
CMD ["./bin/run-prod.sh"]
WORKDIR /app

COPY . /app

# Pin a known to work with peep pip version.
RUN pip install pip==6.0.0 && \
    ./bin/peep.py install -r requirements.txt
