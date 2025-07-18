FROM python:3.10-slim

WORKDIR /app

# Instala dependências básicas
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Cria virtualenv opcional
# RUN python -m venv venv
# ENV PATH="/app/venv/bin:$PATH"

# Criar o diretório — sem COPY ainda pois o projeto está vazio
RUN mkdir -p /app

EXPOSE 8000
