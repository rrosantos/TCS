# Sistema de Controle de Cinema

Um sistema web completo para gerenciamento de cinema desenvolvido com HTML, CSS (Bootstrap), JavaScript e localStorage.

## 📋 Descrição do Projeto

Este sistema permite gerenciar todas as operações básicas de um cinema, incluindo:

- **Cadastro de Filmes**: Gerenciar catálogo de filmes com informações detalhadas
- **Cadastro de Salas**: Configurar salas com diferentes capacidades e tipos
- **Programação de Sessões**: Agendar exibições vinculando filmes às salas
- **Venda de Ingressos**: Sistema completo de vendas com controle de ocupação
- **Listagem de Sessões**: Visualização da programação em diferentes formatos

## 🚀 Funcionalidades

### 📽️ Gerenciamento de Filmes

- ✅ Cadastro completo (título, gênero, duração, sinopse, classificação)
- ✅ Edição e exclusão de filmes
- ✅ Busca e filtros avançados
- ✅ Validação de dados e duplicatas
- ✅ Verificação de dependências (filmes em sessões)

### 🏢 Gerenciamento de Salas

- ✅ Cadastro com número, capacidade e tipo de projeção
- ✅ Suporte a diferentes tipos (Tradicional, 3D, IMAX, VIP, 4DX, Dolby Atmos)
- ✅ Estatísticas de ocupação
- ✅ Filtros e ordenação
- ✅ Controle de dependências (salas em uso)

### ⏰ Programação de Sessões

- ✅ Vinculação de filmes e salas
- ✅ Controle de conflitos de horário
- ✅ Definição de preços personalizados
- ✅ Verificação automática de disponibilidade
- ✅ Margem de segurança entre sessões (30 min)

### 🎫 Venda de Ingressos

- ✅ Interface intuitiva para seleção de sessões
- ✅ Controle em tempo real de disponibilidade
- ✅ Cadastro de dados do cliente
- ✅ Cálculo automático de totais
- ✅ Histórico de vendas
- ✅ Comprovante de compra

### 📊 Programação e Relatórios

- ✅ Múltiplas visualizações (lista, grade, por filme)
- ✅ Filtros avançados (data, filme, sala)
- ✅ Estatísticas em tempo real
- ✅ Detalhes completos das sessões
- ✅ Exportação de dados
- ✅ Função de impressão

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica das páginas
- **CSS3**: Estilização customizada
- **Bootstrap 5.3**: Framework CSS responsivo
- **JavaScript ES6+**: Lógica de negócio e interações
- **localStorage**: Persistência de dados no navegador
- **Bootstrap Icons**: Ícones consistentes

## 📁 Estrutura do Projeto

```
LAB05/
├── index.html                 # Página inicial com menu principal
├── cadastro-filmes.html       # Gerenciamento de filmes
├── cadastro-salas.html        # Gerenciamento de salas
├── cadastro-sessoes.html      # Programação de sessões
├── venda-ingressos.html       # Sistema de vendas
├── listagem-sessoes.html      # Visualização da programação
├── assets/
│   ├── css/
│   │   └── style.css         # Estilos customizados
│   └── js/
│       └── cinema.js         # Lógica principal do sistema
└── README.md                 # Documentação
```

## 🎯 Como Usar

### 1. Primeiro Acesso

- Abra o arquivo `index.html` em um navegador moderno
- O sistema inicializará automaticamente com dados de exemplo
- Use o menu de navegação para acessar as diferentes funcionalidades

### 2. Fluxo Recomendado

1. **Cadastrar Filmes**: Adicione os filmes que serão exibidos
2. **Cadastrar Salas**: Configure as salas do cinema
3. **Programar Sessões**: Vincule filmes às salas em horários específicos
4. **Vender Ingressos**: Realize as vendas para as sessões programadas
5. **Consultar Programação**: Visualize e gerencie a programação completa

### 3. Funcionalidades Principais

#### Cadastro de Filmes

- Preencha todos os campos obrigatórios (título, gênero, duração, classificação)
- Use a busca para localizar filmes específicos
- Edite ou exclua filmes conforme necessário
- ⚠️ Filmes em uso em sessões não podem ser excluídos

#### Cadastro de Salas

- Defina número único para cada sala
- Configure capacidade e tipo de projeção
- Visualize estatísticas de ocupação
- Use filtros para organizar a listagem

#### Programação de Sessões

- Selecione filme e sala disponíveis
- Escolha data e horário (sistema verifica conflitos)
- Defina preço do ingresso
- O sistema impede conflitos de horário automaticamente

#### Venda de Ingressos

- Filtre sessões por data, filme ou sala
- Selecione quantidade de ingressos desejada
- Preencha dados do cliente
- Confirme a venda e gere comprovante

#### Visualização da Programação

- **Lista Detalhada**: Visão completa com todas as informações
- **Grade de Horários**: Layout em tabela por sala e horário
- **Por Filme**: Agrupamento por filme com todas as sessões
- Use filtros para personalizar a visualização

## 💡 Características Técnicas

### Validações Implementadas

- ✅ Campos obrigatórios em todos os formulários
- ✅ Validação de e-mail e telefone
- ✅ Verificação de duplicatas (títulos de filmes, números de salas)
- ✅ Controle de conflitos de horário
- ✅ Verificação de disponibilidade de lugares
- ✅ Validação de datas (não permite datas passadas)

### Recursos de UX/UI

- ✅ Interface responsiva (funciona em desktop e mobile)
- ✅ Feedback visual para ações do usuário
- ✅ Alerts informativos para sucessos e erros
- ✅ Loading states e validações em tempo real
- ✅ Navegação intuitiva com breadcrumbs
- ✅ Ícones consistentes em todo o sistema

### Persistência de Dados

- ✅ Armazenamento local usando localStorage
- ✅ Estrutura JSON organizada por entidades
- ✅ Relacionamentos entre dados mantidos
- ✅ Backup automático a cada operação
- ✅ Inicialização com dados de exemplo

## 🔧 Requisitos do Sistema

- **Navegador**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript**: Habilitado
- **localStorage**: Suportado (disponível em todos os navegadores modernos)
- **Internet**: Apenas para carregar Bootstrap e ícones (CDN)

## 📊 Dados de Exemplo

O sistema inclui dados pré-cadastrados para demonstração:

### Filmes

- Vingadores: Ultimato (Ação/Ficção - 181 min)
- Parasita (Drama/Thriller - 132 min)
- Toy Story 4 (Animação/Família - 100 min)

### Salas

- Sala 1: Tradicional (100 lugares)
- Sala 2: 3D (80 lugares)
- Sala 3: IMAX (120 lugares)
- Sala 4: VIP (60 lugares)

## 🎨 Personalização

### Modificar Estilos

Edite o arquivo `assets/css/style.css` para customizar:

- Cores do tema
- Espaçamentos e layouts
- Animações e transições
- Responsividade

### Adicionar Funcionalidades

No arquivo `assets/js/cinema.js` você pode:

- Adicionar novos tipos de sala
- Incluir campos personalizados
- Implementar novos relatórios
- Criar integrações externas

## 🔍 Conceitos Demonstrados

Este projeto implementa diversos conceitos importantes:

### JavaScript

- ✅ Manipulação do DOM
- ✅ Event listeners e propagação
- ✅ Classes e programação orientada a objetos
- ✅ Funções arrow e métodos de array
- ✅ Template literals e interpolação
- ✅ Promises e programação assíncrona
- ✅ Módulos e organização de código

### HTML/CSS

- ✅ Formulários complexos com validação
- ✅ Layouts responsivos com Bootstrap
- ✅ Componentes interativos (modais, cards)
- ✅ Acessibilidade e semântica
- ✅ CSS Grid e Flexbox

### Engenharia de Software

- ✅ Separação de responsabilidades
- ✅ Reutilização de código
- ✅ Tratamento de erros
- ✅ Validação de dados
- ✅ Interface de usuário intuitiva

## 🏆 Próximas Melhorias

Possíveis evoluções do sistema:

- 🔄 Integração com backend real
- 💳 Sistema de pagamento online
- 📱 Aplicativo mobile
- 🎯 Sistema de reservas
- 📧 Notificações por e-mail
- 📈 Relatórios avançados
- 👥 Sistema multi-usuário
- 🎫 Código de barras nos ingressos

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso de Tecnologias para Construção de Software.

---

**Desenvolvido com ❤️ usando Bootstrap e JavaScript puro**
