
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Установка образов и запуск контейнеров Docker c базой данных Mongo для бэкенда производится следующей командой:

```
docker compose \
--file ./docker-compose.dev.yml \
--env-file ./.backend.env \
--project-name "fit-friends" up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

