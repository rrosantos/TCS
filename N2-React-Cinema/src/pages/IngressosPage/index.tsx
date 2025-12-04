import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type IIngresso, VALOR_INTEIRA, VALOR_MEIA } from '../../models/ingresso.model';
import { type ISessao } from '../../models/sessao.model';
import { type IFilme } from '../../models/filme.model';
import { type ISala } from '../../models/sala.model';
import { ingressoService, sessaoService, filmeService, salaService } from '../../services/api.service';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Alert } from '../../components/Alert';

export const IngressosPage = () => {
    const [ingressos, setIngressos] = useState<IIngresso[]>([]);
    const [sessoes, setSessoes] = useState<ISessao[]>([]);
    const [filmes, setFilmes] = useState<IFilme[]>([]);
    const [salas, setSalas] = useState<ISala[]>([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [filmesData, salasData, sessoesData, ingressosData] = await Promise.all([
                filmeService.findAll(),
                salaService.findAll(),
                sessaoService.findAll(),
                ingressoService.findAll()
            ]);
            setFilmes(filmesData);
            setSalas(salasData);
            setSessoes(sessoesData);
            setIngressos(ingressosData);
        } catch (error) {
            setAlert({ message: 'Erro ao carregar dados!', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Deseja excluir este ingresso vendido?')) {
            try {
                await ingressoService.delete(id);
                await carregarDados();
                setAlert({ message: 'Ingresso excluído!', type: 'success' });
            } catch (error) {
                setAlert({ message: 'Erro ao excluir ingresso!', type: 'danger' });
            }
        }
    };

    // Calcular totais
    const totalVendido = ingressos.reduce((acc, ing) => acc + ing.valorUnitario, 0);
    const totalInteiras = ingressos.filter(i => i.tipo === 'inteira').length;
    const totalMeias = ingressos.filter(i => i.tipo === 'meia').length;

    return (
        <div className="container mt-4">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-info">
                        <i className="bi bi-ticket-perforated me-2"></i>Ingressos Vendidos
                    </h2>
                </div>
            </div>

            {/* Cards de Resumo */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-ticket-perforated display-4"></i>
                            <h3 className="mt-2">{ingressos.length}</h3>
                            <p className="mb-0">Total de Ingressos</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-cash-stack display-4"></i>
                            <h3 className="mt-2">{formatCurrency(totalVendido)}</h3>
                            <p className="mb-0">Total Arrecadado</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card bg-info text-white h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-pie-chart display-4"></i>
                            <h3 className="mt-2">{totalInteiras} / {totalMeias}</h3>
                            <p className="mb-0">Inteiras / Meias</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela de Preços */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-secondary text-white">
                            <h5 className="mb-0"><i className="bi bi-tag me-2"></i>Tabela de Preços</h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="p-3 bg-light rounded">
                                        <i className="bi bi-ticket-detailed display-5 text-primary"></i>
                                        <h5 className="mt-2">Inteira</h5>
                                        <h3 className="text-success">{formatCurrency(VALOR_INTEIRA)}</h3>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 bg-light rounded">
                                        <i className="bi bi-ticket display-5 text-warning"></i>
                                        <h5 className="mt-2">Meia</h5>
                                        <h3 className="text-success">{formatCurrency(VALOR_MEIA)}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0"><i className="bi bi-cart-plus me-2"></i>Como Vender</h5>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <p className="text-center mb-3">
                                Para vender ingressos, acesse o módulo de <strong>Sessões</strong> e clique no botão <strong>"Vender"</strong> na sessão desejada.
                            </p>
                            <div className="text-center">
                                <Link to="/sessoes" className="btn btn-success btn-lg">
                                    <i className="bi bi-ticket-perforated me-2"></i>Ir para Sessões
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Ingressos Vendidos */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>Histórico de Vendas</h5>
                            <span className="badge bg-light text-info">{ingressos.length} ingressos</span>
                        </div>
                        <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="text-center p-3">
                                    <div className="spinner-border text-info" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            ) : ingressos.length === 0 ? (
                                <div className="text-center text-muted p-5">
                                    <i className="bi bi-ticket-perforated display-1 mb-3"></i>
                                    <h4>Nenhum ingresso vendido</h4>
                                    <p>Vá até o módulo de Sessões para vender ingressos.</p>
                                    <Link to="/sessoes" className="btn btn-primary">
                                        <i className="bi bi-arrow-right me-2"></i>Ir para Sessões
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Filme</th>
                                                <th>Sessão</th>
                                                <th>Cliente</th>
                                                <th>Tipo</th>
                                                <th>Valor</th>
                                                <th>Data Venda</th>
                                                <th className="text-end">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ingressos.map(ingresso => {
                                                const sessao = sessoes.find(s => s.id === ingresso.sessaoId);
                                                const filme = sessao ? filmes.find(f => f.id === sessao.filmeId) : null;
                                                const sala = sessao ? salas.find(s => s.id === sessao.salaId) : null;
                                                return (
                                                    <tr key={ingresso.id}>
                                                        <td>
                                                            <span className="badge bg-secondary">{ingresso.id}</span>
                                                        </td>
                                                        <td>
                                                            <i className="bi bi-film me-2"></i>
                                                            {filme?.titulo || 'N/A'}
                                                        </td>
                                                        <td>
                                                            <small>
                                                                Sala {sala?.numero || '?'}<br />
                                                                {sessao ? `${formatDate(sessao.data)} ${sessao.horario}` : 'N/A'}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <i className="bi bi-person me-2"></i>
                                                            {ingresso.nomeCliente || <span className="text-muted">Não informado</span>}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${ingresso.tipo === 'inteira' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                                                {ingresso.tipo === 'inteira' ? 'Inteira' : 'Meia'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <strong className="text-success">{formatCurrency(ingresso.valorUnitario)}</strong>
                                                        </td>
                                                        <td>
                                                            <i className="bi bi-calendar me-2"></i>
                                                            {formatDate(ingresso.dataVenda)}
                                                        </td>
                                                        <td className="text-end">
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger" 
                                                                onClick={() => ingresso.id && handleDelete(ingresso.id)}
                                                                title="Excluir ingresso">
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
