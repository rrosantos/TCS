// Utilitários para localStorage
class StorageManager {
    static save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    static clear(key) {
        localStorage.removeItem(key);
    }
}

// Classes para representar entidades
class Filme {
    constructor(id, titulo, descricao, genero, classificacao, duracao, dataEstreia) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.genero = genero;
        this.classificacao = classificacao;
        this.duracao = duracao;
        this.dataEstreia = dataEstreia;
    }
}

class Sala {
    constructor(id, nome, capacidade, tipo) {
           this.id = id;
           this.nome = nome;
           this.capacidade = capacidade;
           this.tipo = tipo;
           this.observacoes = '';
    }
}

class Sessao {
    constructor(id, filmeId, salaId, data, horario, preco) {
        this.id = id;
        this.filmeId = filmeId;
        this.salaId = salaId;
        this.data = data;
        this.horario = horario;
        this.preco = preco;
        this.ingressosVendidos = 0;
    }
}

class Ingresso {
    constructor(id, sessaoId, quantidade, total, dataCompra) {
        this.id = id;
        this.sessaoId = sessaoId;
        this.quantidade = quantidade;
        this.total = total;
        this.dataCompra = dataCompra;
    }
}

// Funções utilitárias
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Remove o alerta após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatTime(timeString) {
    return timeString;
}

// Validações
function validateRequired(fields) {
    for (let field of fields) {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            showAlert(`O campo ${element.previousElementSibling.textContent} é obrigatório!`, 'danger');
            element.focus();
            return false;
        }
    }
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePositiveNumber(value) {
    return !isNaN(value) && parseFloat(value) > 0;
}

// Inicialização de dados de exemplo (apenas na primeira execução)
function initializeExampleData() {
    if (!localStorage.getItem('cinema_initialized')) {
        // Filmes de exemplo
        const filmesExemplo = [
            {
                id: generateId(),
                titulo: 'Vingadores: Ultimato',
                descricao: 'A batalha final contra Thanos. Os heróis mais poderosos da Terra devem se unir para derrotar o titã louco.',
                genero: 'Ação',
                classificacao: '12 anos',
                duracao: 181,
                dataEstreia: '2019-04-25'
            },
            {
                id: generateId(),
                titulo: 'Parasita',
                descricao: 'Uma família pobre se infiltra na vida de uma família rica. Um thriller social coreano premiado.',
                genero: 'Drama',
                classificacao: '16 anos',
                duracao: 132,
                dataEstreia: '2019-05-30'
            },
            {
                id: generateId(),
                titulo: 'Toy Story 4',
                descricao: 'Woody e seus amigos em uma nova aventura. A quarta parte da saga dos brinquedos.',
                genero: 'Animação',
                classificacao: 'Livre',
                duracao: 100,
                dataEstreia: '2019-06-20'
            }
        ];
        StorageManager.save('filmes', filmesExemplo);

        // Salas de exemplo
        const salasExemplo = [
            new Sala(generateId(), 'Sala Principal', 100, '2D'),
            new Sala(generateId(), 'Sala Premium', 80, '3D'),
            new Sala(generateId(), 'Sala IMAX', 120, 'IMAX'),
            new Sala(generateId(), 'Sala VIP', 60, '2D')
        ];
        StorageManager.save('salas', salasExemplo);

        localStorage.setItem('cinema_initialized', 'true');
    }
}