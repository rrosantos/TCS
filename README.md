# TCS Full-Stack Dev Environment

Este repositório contém um ambiente de desenvolvimento padronizado com Docker Compose para um app full‑stack (React + Vite, NestJS, Postgres, pgAdmin e Nginx).

## Requisitos

- Docker e Docker Compose

## Subir o ambiente (com um único comando)

1. Revise o arquivo `.env` na raiz para ajustar portas e credenciais.

2. Inicie tudo com um único comando (você pode usar a forma compatível com sua instalação):

```zsh
# Compose v2 (plugin do Docker)
docker compose up --build

# OU Compose v1 (binário legado)
docker-compose up --build
```

3. URLs principais (valores padrão do `.env`):

- App via Nginx: http://localhost:80
- API via Nginx: http://localhost:80/api/health
- Frontend (direto): http://localhost:3000
- Backend (direto): http://localhost:4000
- pgAdmin: http://localhost:5050
- Postgres (host): localhost:5433 (usuário/senha/banco no `.env`)

Credenciais do pgAdmin: `PGADMIN_DEFAULT_EMAIL` e `PGADMIN_DEFAULT_PASSWORD` do `.env`.

## Desenvolvimento (hot-reload)

- O frontend (Vite) e o backend (NestJS `start:dev`) rodam com hot-reload dentro dos containers.
- Os diretórios locais `frontend/` e `backend/` são montados nos containers, então mudanças no código são refletidas sem rebuild.
- `CHOKIDAR_USEPOLLING=true` já está definido para melhorar a detecção de mudanças em Docker/Linux.

Verificações rápidas:

- Edite `frontend/src/App.jsx` e veja o navegador recarregar.
- Edite a resposta em `backend/src/app.controller.ts` e teste `curl http://localhost/api/health`.

## Estrutura

- `frontend/`: Vite + React (porta 3000 no container)
- `backend/`: NestJS (porta 4000 no container)
- `db`: Postgres com volume persistente
- `pgadmin`: Admin do Postgres com volume persistente
- `nginx`: Proxy reverso com roteamento

## Roteamento (Nginx)

- `/` → encaminha para o frontend (`frontend:3000`).
- `/api/...` → encaminha para o backend (`backend:4000/...`) removendo o prefixo `/api`.

## Persistência de dados

- O Postgres usa o volume nomeado `db_data` e o pgAdmin usa `pgadmin_data` — seus dados persistem entre `down`/`up`.
- Use `docker-compose down` (ou `docker compose down`) para parar a stack mantendo os volumes.
- Somente se você usar a flag `-v` (ex.: `down -v`) os volumes serão apagados (e, portanto, os dados).

## Dicas & Troubleshooting

- Conflito de porta do Postgres: para evitar conflito com um Postgres local em `5432`, mapeamos por padrão a porta do host para `5433`. Altere `POSTGRES_PORT` no `.env` se preferir outro valor.
- Conexão no pgAdmin:
  - Dentro do Docker (host: `db`, porta: `5432`).
  - A partir do host: `localhost:5433` (ou a porta configurada no `.env`).
- Compose v1 vs v2: se `docker compose` não existir no seu sistema, use `docker-compose`.

## Variáveis de ambiente principais

Veja `.env` para:

- FRONTEND_PORT, BACKEND_PORT
- POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT
- PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD, PGADMIN_PORT
- NGINX_PORT
