# syntax=docker/dockerfile:1

##
## STEP 1 - SETUP BASE IMAGE
##

FROM node:20.16.0-bullseye AS base
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

## Remove unnecessary files from `node_modules` directory
RUN ( wget -q -O /dev/stdout https://gobinaries.com/tj/node-prune | sh ) \
 && node-prune

##
## STEP 2 - BUILD
##

FROM base AS build
ENV NODE_ENV=development
COPY . .
## This step could install only the missing dependencies (ie., development deps ones)
RUN npm ci
## Compile the TypeScript source code
RUN npm run build

##
## STEP 3 - PRODUCTION
##

FROM node:20.16.0-bullseye-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app
## Copy required file to run the production application
COPY --from=base --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=base --chown=node:node /usr/src/app/*.json ./
COPY --from=build --chown=node:node /usr/src/app/dist ./dist/

RUN apt-get update && apt-get install -y dumb-init && \
    npm ci --omit=dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    whereis dumb-init

## Dropping privileges    
USER node

## Running the app wrapped by the init system for helping on graceful shutdowns
CMD ["dumb-init", "node", "dist/server.js"]
