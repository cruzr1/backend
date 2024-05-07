FROM node:18.18-alpine
WORKDIR /opt/fit-friends/backend
COPY ./package.json .
RUN npm install --omit=dev
COPY ./dist .
CMD ["node", "./main.js"]
