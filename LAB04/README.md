# Sistema de Gestão de Funcionários - LAB04

Sistema web para gestão de funcionários de uma startup, implementando conceitos de JavaScript moderno, Classes, Arrow Functions, Métodos de Array (map, filter, reduce) e Streams JS.

## Executando com Docker

### Comandos de Execução

```bash

# Construir e executar o container
docker-compose up --build

# Parar o container
docker-compose down
```

### Acesso à Aplicação

Após executar o container, acesse:

- **URL**: http://localhost:8080
- **Porta**: 8080 (mapeada para porta 80 do nginx)

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Conceitos JS**: Classes, Arrow Functions, Destructuring, Template Literals
- **Métodos de Array**: `map()`, `filter()`, `reduce()`, `find()`, `some()`
- **Servidor Web**: Nginx (Alpine Linux)
- **Containerização**: Docker + Docker Compose

## Relatórios Disponíveis

1. **Funcionários com Salário > R$ 5.000** - Filtro usando `filter()`
2. **Média Salarial** - Cálculo usando `reduce()`
3. **Cargos Únicos** - Extração usando `map()` + `Set()`
4. **Nomes em Maiúsculo** - Transformação usando `map()`
5. **Relatório Completo** - Análise combinada com múltiplos métodos

## Estrutura do Projeto

```
LAB04/
├── sistema-funcionarios.html    # Aplicação principal (HTML + CSS + JS)
├── Dockerfile                   # Configuração do container
├── docker-compose.yml           # Orquestração Docker
├── .dockerignore               # Arquivos ignorados no build
└── README.md                   # Esta documentação
```
