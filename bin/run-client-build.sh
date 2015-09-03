#!/bin/sh

# Remove host-side node_modules, just in case. If present, it will override
# /home/webdev/node_modules and cause various unpleasantries
rm -rf /app/node_modules

# Be very specific about starting up a gulp process that uses modules from
# /home/webdev/node_modules and restarts whenever gulpfile.babel.js is changed
NODE_PATH=/home/webdev/node_modules/ \
    /usr/local/bin/node \
        /home/webdev/node_modules/nodemon/bin/nodemon.js \
            --watch /app/gulpfile.babel.js \
            /home/webdev/node_modules/gulp/bin/gulp.js
