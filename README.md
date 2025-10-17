# TCS - Repositório da Matéria

Este repositório contém todos os laboratórios e trabalhos da disciplina TCS.

## Estrutura dos Laboratórios

### LAB01 - Git Colaborativo
- **Pasta**: `LAB01/lab-git-colaborativo-cmp2304/`
- **Conteúdo**: Laboratório sobre Git colaborativo
- **Arquivos principais**:
  - `curriculo.html` - Currículo em HTML
  - `README.md` - Documentação do lab
  - `LISTA DE ALUNOS.txt` - Lista de participantes

### LAB02 - Aplicação Full Stack
- **Pasta**: `LAB02/`
- **Conteúdo**: Aplicação completa com Docker
- **Estrutura**:
  - `backend/` - API em NestJS
  - `frontend/` - Interface em React/Vite
  - `nginx/` - Configuração do servidor web
  - `docker-compose.yml` - Orquestração dos containers

### LAB03 - Cadastro de Alunos
- **Pasta**: `LAB03/`
- **Conteúdo**: Sistema de cadastro em HTML
- **Arquivos**:
  - `cadastro-alunos.html` - Formulário de cadastro
  - `fdfb.html` - Arquivo adicional

---

## LAB02 - Ambiente Full-Stack com Docker

### Requisitos
- Docker e Docker Compose

### Como executar

1. Navegue para a pasta LAB02:
```bash
cd LAB02
```

2. Revise o arquivo `.env` na raiz para ajustar portas e credenciais.

3. Inicie tudo com um único comando:
```bash
# Compose v2 (plugin do Docker)
docker compose up --build

# OU Compose v1 (binário legado)
docker-compose up --build
```

### URLs principais (valores padrão do `.env`)
- App via Nginx: http://localhost:80
- API via Nginx: http://localhost:80/api/health
- Frontend (direto): http://localhost:3000
- Backend (direto): http://localhost:4000
- pgAdmin: http://localhost:5050
- Postgres (host): localhost:5433

### Desenvolvimento (hot-reload)
- O frontend (Vite) e o backend (NestJS `start:dev`) rodam com hot-reload dentro dos containers.
- Os diretórios locais são montados nos containers, então mudanças no código são refletidas sem rebuild.

### Estrutura do LAB02
- `frontend/`: Vite + React (porta 3000 no container)
- `backend/`: NestJS (porta 4000 no container)
- `db`: Postgres com volume persistente
- `pgadmin`: Admin do Postgres com volume persistente
- `nginx`: Proxy reverso com roteamento

---

## Como usar

Cada laboratório está organizado em sua própria pasta com documentação específica.

Para rodar os projetos, consulte os README individuais de cada pasta.

_Última atualização: 17 de outubro de 2025_
