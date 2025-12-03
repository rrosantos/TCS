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
