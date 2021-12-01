FROM scrapper-gate-base as builder
WORKDIR /app

RUN apt-get update -y

COPY ./apps/api ./apps/api

RUN npm run gql-codegen
RUN npx nx run api:build

FROM node:16.10.0
WORKDIR /app

RUN apt-get update

COPY --from=builder /app/dist/apps/api ./

RUN npm install --production

CMD ["node", "main.js"]
