FROM --platform=linux/amd64 node:16.10.0
WORKDIR /app

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    apt-get update -y && \
    apt-get install -y xvfb

COPY ./package.json ./package-lock.json ./workspace.json ./tsconfig.json ./tsconfig.base.json ./tsconfig.node.json ./.eslintrc.json ./babel.config.json ./nx.json ./codegen.yml ./jest.preset.js /jest.config.js ./

COPY ./apps/browser-extension ./apps/browser-extension
COPY ./libs ./libs
COPY ./typings ./typings
COPY ./tools ./tools
COPY ./tests ./tests

RUN npm ci
RUN npx playwright install-deps
RUN npm run gql-codegen
RUN npm run build:tools
RUN npx nx run browser-extension:build:production

RUN export DISPLAY=:99

ADD apps/browser-extension-e2e/docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT [ "/docker-entrypoint.sh" ]
