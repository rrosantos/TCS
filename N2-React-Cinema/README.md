# N2-React-Cinema

Sistema de Controle de Cinema desenvolvido em React + TypeScript + Vite.

## 🚀 Funcionalidades

- **Cadastro de Filmes**: Adicione e gerencie o catálogo de filmes
- **Cadastro de Salas**: Configure as salas do cinema com capacidade e tipo de projeção
- **Cadastro de Sessões**: Programe sessões vinculando filmes às salas
- **Venda de Ingressos**: Realize a venda de ingressos para as sessões
- **Programação**: Visualize todas as sessões disponíveis

## 📦 Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM
- Bootstrap 5
- Bootstrap Icons
- Zod (validações)
- LocalStorage (persistência de dados)

## 🛠️ Como executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Acesse a pasta do projeto:

   ```bash
   cd N2-React-Cinema
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o projeto:

   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   ```
   http://localhost:5173
   ```

## 📁 Estrutura do Projeto

```
N2-React-Cinema/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Alert/
│   │   └── Nav/
│   ├── models/           # Interfaces e schemas
│   │   ├── filme.model.ts
│   │   ├── sala.model.ts
│   │   ├── sessao.model.ts
│   │   └── ingresso.model.ts
│   ├── pages/            # Páginas da aplicação
│   │   ├── HomePage/
│   │   ├── FilmesPage/
│   │   ├── SalasPage/
│   │   ├── SessoesPage/
│   │   ├── IngressosPage/
│   │   └── ProgramacaoPage/
│   ├── routers/          # Configuração de rotas
│   ├── services/         # Serviços (localStorage)
│   ├── utils/            # Utilitários (formatadores)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📝 Notas

- Os dados são persistidos no localStorage do navegador
- Baseado no projeto LAB05 (HTML/CSS/JS) convertido para React
