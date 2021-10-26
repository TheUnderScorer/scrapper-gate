FROM ghcr.io/theunderscorer/scrapper-gate-base:latest
WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y xvfb && \
    apt install chromium -y

COPY ./apps/browser-extension ./apps/browser-extension
COPY ./apps/browser-extension-e2e ./apps/browser-extension-e2e

RUN npm run gql-codegen
RUN npx nx run browser-extension:build:production

RUN export DISPLAY=:99

ADD apps/browser-extension-e2e/docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT [ "/docker-entrypoint.sh" ]
