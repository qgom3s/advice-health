# Código Dockerfile para a base do frontend - Revisar!
FROM node:18

WORKDIR /app

COPY package.json package-lock.json* /app/
RUN npm install

COPY . /app

EXPOSE 3000
