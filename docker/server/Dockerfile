ARG IMAGE=node:15.2-alpine

FROM $IMAGE as build

WORKDIR /app

COPY . .

RUN npm ci --legacy-peer-deps

RUN npm run build:server

FROM $IMAGE

COPY --chown=node:node --from=build /app/package.json /app/package.json
COPY --chown=node:node --from=build /app/src/app/server/package.json /app/src/app/server/package.json
COPY --chown=node:node --from=build /app/src/app/server/build /app/src/app/server/build
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/docker/server/docker_entrypoint.sh /docker_entrypoint.sh

RUN chmod +x /docker_entrypoint.sh
ENTRYPOINT [ "/docker_entrypoint.sh" ]

USER node

EXPOSE 5000
