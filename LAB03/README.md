# Cadastro de Alunos - Docker

Este projeto contém uma aplicação web simples para cadastro de alunos, executada em um container Docker usando Nginx.

## 🚀 Como executar

### Pré-requisitos

- Docker
- Docker Compose

### Comandos para execução

1. **Construir e iniciar o container:**

   ```bash
   docker-compose up --build -d
   ```

2. **Parar o container:**

   ```bash
   docker-compose down
   ```

3. **Ver logs do container:**

   ```bash
   docker-compose logs -f
   ```

4. **Reconstruir após mudanças:**
   ```bash
   docker-compose up --build -d
   ```

### Acesso à aplicação

Após iniciar o container, a aplicação estará disponível em:

- **URL:** http://localhost:8080

## 📋 Funcionalidades

- Cadastro de alunos com nome, idade, curso e nota
- Edição e exclusão de alunos
- Relatórios:
  - Lista de alunos aprovados
  - Média das notas
  - Média das idades
  - Nomes em ordem alfabética
  - Quantidade de alunos por curso

## 📝 Notas

- A aplicação roda na porta 8080 do host
- Os dados são armazenados apenas em memória (não persistem após reiniciar)
- Baseado em HTML, CSS e JavaScript
