ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

FROM node:16.10.0
WORKDIR /app

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    apt-get update -y

COPY ./package.json ./package-lock.json ./workspace.json ./tsconfig.json ./tsconfig.base.json ./tsconfig.node.json ./.eslintrc.json ./babel.config.json ./nx.json ./codegen.yml ./jest.preset.js /jest.config.js ./
COPY ./libs ./libs
COPY ./typings ./typings
COPY ./tools ./tools
COPY ./tests ./tests

RUN npm ci
RUN npm run gql-codegen
RUN npm run build:tools
