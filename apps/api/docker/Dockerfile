FROM node:16-alpine as builder
WORKDIR /app

RUN apk update

COPY ./package.json ./package-lock.json ./workspace.json ./tsconfig.json ./tsconfig.base.json ./tsconfig.node.json ./.eslintrc.json ./babel.config.json ./nx.json ./codegen.yml ./

COPY ./apps/api ./apps/api
COPY ./libs ./libs
COPY ./typings ./typings
COPY ./tools ./tools

RUN npm ci
RUN npm run gql-codegen
RUN npm run build:tools
RUN npx nx run api:build

FROM node:16-alpine
WORKDIR /app

RUN apk update

COPY --from=builder /app/dist/apps/api ./

RUN npm install --production

CMD ["node", "apps/api/src/main.js"]
