FROM python:3

EXPOSE 8000
CMD ["./bin/run-prod.sh"]

WORKDIR /app

# Install compiled package dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python-dev \
        gettext

# TODO: Just install a Debian package when 0.12 is official in jessie

# HACK: Temporary node 0.12.7 installation
# see also: https://github.com/nodejs/docker-node/blob/d798690bdae91174715ac083e31198674f044b68/0.12/Dockerfile

# verify gpg and sha256: http://nodejs.org/dist/v0.10.30/SHASUMS256.txt.asc
# gpg: aka "Timothy J Fontaine (Work) <tj.fontaine@joyent.com>"
# gpg: aka "Julien Gilli <jgilli@fastmail.fm>"
RUN set -ex \
	&& for key in \
		7937DFD2AB06298B2293C3187D33FF9D0246406D \
		114F43EE0176B71C7BC219DD50A3051F888C628D \
	; do \
		gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
	done

ENV NODE_VERSION 0.12.7
ENV NPM_VERSION 2.14.1
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/node-v$NODE_VERSION-linux-x64/bin

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
	&& curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
	&& gpg --verify SHASUMS256.txt.asc \
	&& grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
	&& tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local \
	&& rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
	&& npm install -g npm@"$NPM_VERSION" \
	&& npm cache clear

# Install & cache dependencies for frontend build
COPY package.json /app/package.json
RUN npm install

# Install & cache dependencies for Django/Python using peep with a supported
# pinned version of pip
COPY requirements.txt /app/requirements.txt
COPY bin/peep.py /app/bin/peep.py
RUN pip install pip==6.0.0 && \
    ./bin/peep.py install -r requirements.txt

# Finally, copy in the whole app after dependencies have been installed & cached
COPY . /app

# Build the frontend client assets
RUN node ./node_modules/gulp/bin/gulp.js build

# Clean up some build tools & artifacts
# see also: https://github.com/docker-library/buildpack-deps/blob/e88116df8558bd129851862e1bf56250ea52ec90/jessie/Dockerfile
RUN apt-get purge -y --auto-remove \
		autoconf \
		automake \
		g++ \
		gcc \
		make \
		patch \
    && rm -rf \
        node_modules \
        /usr/local/node-v$NODE_VERSION-linux-x64 \
        /var/lib/apt/lists/*
