# Информация для запуска проекта

## Перед первым запуском проекта необходимо:

1) в консольном окне терминала запустить команду установки зависимостей

```bash
$ npm install
```

2) в корневой папке папке проекта создать файл с переменными окружения по аналогии с образцом (файл .backend.env.example).

3) запустить контейнеры Docker

```bash
docker compose \
--file ./docker-compose.yml \
--env-file ./.backend.env \
--project-name "fit-friends" up -d
```

## Сценарии запуска проекта:


### Запуск в режиме development

```bash
$ npm run start
```

### Запуск в режиме watch

```bash
$ npm run start:dev
```

### Запуск в режиме production

```bash
$ npm run start:prod
```

### Запуск в режиме debug

```bash
$ npm run start:prod
```

### Запуск линтера

```bash
$ npm run lint
```

### Запуск форматтера prettier

```bash
$ npm run format
```

### Сборка проекта в папку dist

```bash
$ npm run build
```

# Начальное наполнение базы

## Для первоначального наполнения базы данных предусмотрены соответствующие REST запросы к сервисам

### Запрос для наполнения базы данных пользователей:

```
GET http://localhost:3000/api/users/seed/2 HTTP/1.1
```

### Запрос для наполнения базы данных тренировок:

```
GET http://localhost:3000/api/trainings/seed/2 HTTP/1.1
```

### Запрос для наполнения базы данных отзывов:

```
GET http://localhost:3000/api/reviews/seed/2 HTTP/1.1
```

## Документация в формате OpenAPI генерируется автоматически с помощью SwaggerModule и доступна по маршруту:

http://localhost:3000/spec
