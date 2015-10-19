FROM python:3

EXPOSE 8000
CMD ["./bin/run-prod.sh"]

WORKDIR /app

# Install & cache dependencies for Django/Python using peep with a supported
# pinned version of pip
COPY requirements.txt /app/requirements.txt
COPY bin/peep.py /app/bin/peep.py
RUN pip install pip==6.0.0 && \
    ./bin/peep.py install -r requirements.txt

# Finally, copy in the whole app after dependencies have been installed & cached
COPY . /app
