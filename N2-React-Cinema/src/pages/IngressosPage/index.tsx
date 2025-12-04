import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type IIngresso, calcularMeia } from '../../models/ingresso.model';
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
    const [form, setForm] = useState({
        sessaoId: 0,
        valorInteira: 0
    });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.sessaoId || form.valorInteira <= 0) {
            setAlert({ message: 'Selecione uma sessão e informe o valor!', type: 'danger' });
            return;
        }

        const existente = ingressos.find(i => i.sessaoId === form.sessaoId);
        if (existente) {
            setAlert({ message: 'Já existe ingresso configurado para esta sessão!', type: 'danger' });
            return;
        }

        const novoIngresso: Omit<IIngresso, 'id'> = {
            sessaoId: form.sessaoId,
            valorInteira: form.valorInteira,
            valorMeia: calcularMeia(form.valorInteira)
        };

        try {
            await ingressoService.create(novoIngresso);
            await carregarDados();
            limparFormulario();
            setAlert({ message: 'Ingresso configurado com sucesso!', type: 'success' });
        } catch (error) {
            setAlert({ message: 'Erro ao criar ingresso!', type: 'danger' });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Deseja excluir este ingresso?')) {
            try {
                await ingressoService.delete(id);
                await carregarDados();
                setAlert({ message: 'Ingresso excluído!', type: 'success' });
            } catch (error) {
                setAlert({ message: 'Erro ao excluir ingresso!', type: 'danger' });
            }
        }
    };

    const limparFormulario = () => {
        setForm({ sessaoId: 0, valorInteira: 0 });
    };

    const sessoesDisponiveis = sessoes.filter(s => !ingressos.find(i => i.sessaoId === s.id));

    return (
        <div className="container mt-4">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-info">
                        <i className="bi bi-ticket-perforated me-2"></i>Gerenciamento de Ingressos
                    </h2>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-5 mb-4">
                    <div className="card">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0"><i className="bi bi-plus-circle me-2"></i>Configurar Ingresso</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label required-field">Sessão</label>
                                    <select className="form-select" value={form.sessaoId}
                                        onChange={(e) => setForm({...form, sessaoId: parseInt(e.target.value)})} required>
                                        <option value={0}>Selecione uma sessão</option>
                                        {sessoesDisponiveis.map(s => {
                                            const filme = filmes.find(f => f.id === s.filmeId);
                                            const sala = salas.find(sl => sl.id === s.salaId);
                                            return (
                                                <option key={s.id} value={s.id}>
                                                    {filme?.titulo} - Sala {sala?.numero} - {formatDate(s.data)} {s.horario}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {sessoes.length === 0 && (
                                        <div className="form-text">
                                            <Link to="/sessoes">Cadastrar sessão primeiro</Link>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Valor Inteira (R$)</label>
                                    <input type="number" className="form-control" min={0.01} step={0.01}
                                        value={form.valorInteira || ''} onChange={(e) => setForm({...form, valorInteira: parseFloat(e.target.value) || 0})} required />
                                </div>

                                <div className="alert alert-secondary">
                                    <i className="bi bi-calculator me-2"></i>
                                    Valor Meia: <strong>{formatCurrency(calcularMeia(form.valorInteira))}</strong>
                                    <small className="d-block text-muted">Calculado automaticamente (50%)</small>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-info text-white" disabled={sessoesDisponiveis.length === 0}>
                                        <i className="bi bi-check-lg me-2"></i>Salvar Ingresso
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={limparFormulario}>
                                        <i className="bi bi-arrow-clockwise me-2"></i>Limpar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7 mb-4">
                    <div className="card">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>Ingressos Configurados</h5>
                            <span className="badge bg-light text-info">{ingressos.length}</span>
                        </div>
                        <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="text-center p-3">
                                    <div className="spinner-border text-info" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            ) : ingressos.length === 0 ? (
                                <div className="text-center text-muted p-3">
                                    <i className="bi bi-ticket-perforated display-4 mb-3"></i>
                                    <p>Nenhum ingresso configurado.</p>
                                </div>
                            ) : (
                                ingressos.map(ingresso => {
                                    const sessao = sessoes.find(s => s.id === ingresso.sessaoId);
                                    const filme = sessao ? filmes.find(f => f.id === sessao.filmeId) : null;
                                    const sala = sessao ? salas.find(s => s.id === sessao.salaId) : null;
                                    return (
                                        <div key={ingresso.id} className="card mb-2">
                                            <div className="card-body p-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <h6 className="mb-1">{filme?.titulo || 'Sessão não encontrada'}</h6>
                                                        <p className="mb-1 small text-muted">
                                                            Sala {sala?.numero || '?'} | {sessao && `${formatDate(sessao.data)} ${sessao.horario}`}
                                                        </p>
                                                        <p className="mb-0">
                                                            <span className="badge bg-primary me-2">Inteira: {formatCurrency(ingresso.valorInteira)}</span>
                                                            <span className="badge bg-success">Meia: {formatCurrency(ingresso.valorMeia)}</span>
                                                        </p>
                                                    </div>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => ingresso.id && handleDelete(ingresso.id)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
