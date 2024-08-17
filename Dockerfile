# syntax=docker/dockerfile:1

##
## STEP 1 - BUILD
##

FROM node:20.16.0-bullseye AS build
WORKDIR /usr/src/app
COPY package*.json ./
# Install dumb-init and verify the installation path
RUN apt-get update && apt-get install -y dumb-init && \
    npm ci --only=production && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    whereis dumb-init  # This will print the location of dumb-init

##
## STEP 2 - DEPLOY
##

FROM node:20.16.0-bullseye-slim
ENV NODE_ENV=production
# Adjust the path according to the output of 'whereis dumb-init' from above
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
CMD ["dumb-init", "node", "dist/server.js"]
