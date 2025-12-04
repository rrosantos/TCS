import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type ISessao, sessaoSchema } from '../../models/sessao.model';
import { type IFilme } from '../../models/filme.model';
import { type ISala } from '../../models/sala.model';
import { type IIngresso, type TipoIngresso, VALOR_INTEIRA, VALOR_MEIA, getValorPorTipo } from '../../models/ingresso.model';
import { sessaoService, filmeService, salaService, ingressoService } from '../../services/api.service';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Alert } from '../../components/Alert';

export const SessoesPage = () => {
    const [sessoes, setSessoes] = useState<ISessao[]>([]);
    const [filmes, setFilmes] = useState<IFilme[]>([]);
    const [salas, setSalas] = useState<ISala[]>([]);
    const [ingressosVendidos, setIngressosVendidos] = useState<IIngresso[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        filmeId: 0,
        salaId: 0,
        data: '',
        horario: ''
    });
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Estado do modal de venda
    const [showModal, setShowModal] = useState(false);
    const [sessaoSelecionada, setSessaoSelecionada] = useState<ISessao | null>(null);
    const [vendaForm, setVendaForm] = useState({
        tipo: 'inteira' as TipoIngresso,
        nomeCliente: ''
    });

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
            setIngressosVendidos(ingressosData);
        } catch (error) {
            setAlert({ message: 'Erro ao carregar dados!', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validação com Zod
        const result = sessaoSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach(err => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            setAlert({ message: 'Corrija os erros do formulário!', type: 'danger' });
            return;
        }

        const novaSessao: Omit<ISessao, 'id'> = {
            filmeId: form.filmeId,
            salaId: form.salaId,
            data: form.data,
            horario: form.horario
        };

        try {
            await sessaoService.create(novaSessao);
            await carregarDados();
            limparFormulario();

            const filme = filmes.find(f => f.id === form.filmeId);
            const sala = salas.find(s => s.id === form.salaId);
            setAlert({ message: `Sessão de "${filme?.titulo}" na Sala ${sala?.numero} criada!`, type: 'success' });
        } catch (error) {
            setAlert({ message: 'Erro ao criar sessão!', type: 'danger' });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Deseja excluir esta sessão?')) {
            try {
                await sessaoService.delete(id);
                await carregarDados();
                setAlert({ message: 'Sessão excluída!', type: 'success' });
            } catch (error) {
                setAlert({ message: 'Erro ao excluir sessão!', type: 'danger' });
            }
        }
    };

    const limparFormulario = () => {
        setErrors({});
        setForm({ filmeId: 0, salaId: 0, data: '', horario: '' });
    };

    const getDataMinima = () => new Date().toISOString().slice(0, 10);

    // Funções do modal de venda
    const abrirModalVenda = (sessao: ISessao) => {
        setSessaoSelecionada(sessao);
        setVendaForm({ tipo: 'inteira', nomeCliente: '' });
        setShowModal(true);
    };

    const fecharModal = () => {
        setShowModal(false);
        setSessaoSelecionada(null);
        setVendaForm({ tipo: 'inteira', nomeCliente: '' });
    };

    const handleVenderIngresso = async () => {
        if (!sessaoSelecionada?.id) return;

        const novoIngresso: Omit<IIngresso, 'id'> = {
            sessaoId: sessaoSelecionada.id,
            tipo: vendaForm.tipo,
            valorUnitario: getValorPorTipo(vendaForm.tipo),
            dataVenda: new Date().toISOString().slice(0, 10),
            nomeCliente: vendaForm.nomeCliente || undefined
        };

        try {
            await ingressoService.create(novoIngresso);
            await carregarDados();
            fecharModal();
            
            const filme = filmes.find(f => f.id === sessaoSelecionada.filmeId);
            setAlert({ 
                message: `Ingresso ${vendaForm.tipo} vendido para "${filme?.titulo}" - ${formatCurrency(novoIngresso.valorUnitario)}`, 
                type: 'success' 
            });
        } catch (error) {
            setAlert({ message: 'Erro ao vender ingresso!', type: 'danger' });
        }
    };

    // Contar ingressos vendidos por sessão
    const contarIngressosSessao = (sessaoId: number) => {
        return ingressosVendidos.filter(i => i.sessaoId === sessaoId).length;
    };

    return (
        <div className="container mt-4">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-primary">
                        <i className="bi bi-clock me-2"></i>Gerenciamento de Sessões
                    </h2>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-5 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0"><i className="bi bi-plus-circle me-2"></i>Nova Sessão</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label required-field">Filme</label>
                                    <select className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`} value={form.filmeId}
                                        onChange={(e) => setForm({...form, filmeId: parseInt(e.target.value)})} required>
                                        <option value={0}>Selecione um filme</option>
                                        {filmes.map(f => <option key={f.id} value={f.id}>{f.titulo} ({f.duracao} min)</option>)}
                                    </select>
                                    {errors.filmeId && <div className="invalid-feedback">{errors.filmeId}</div>}
                                    {filmes.length === 0 && (
                                        <div className="form-text">
                                            <Link to="/filmes">Cadastrar filme primeiro</Link>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Sala</label>
                                    <select className={`form-select ${errors.salaId ? 'is-invalid' : ''}`} value={form.salaId}
                                        onChange={(e) => setForm({...form, salaId: parseInt(e.target.value)})} required>
                                        <option value={0}>Selecione uma sala</option>
                                        {salas.map(s => <option key={s.id} value={s.id}>Sala {s.numero} ({s.capacidade} lugares)</option>)}
                                    </select>
                                    {errors.salaId && <div className="invalid-feedback">{errors.salaId}</div>}
                                    {salas.length === 0 && (
                                        <div className="form-text">
                                            <Link to="/salas">Cadastrar sala primeiro</Link>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Data da Sessão</label>
                                    <input type="date" className={`form-control ${errors.data ? 'is-invalid' : ''}`} min={getDataMinima()}
                                        value={form.data} onChange={(e) => setForm({...form, data: e.target.value})} required />
                                    {errors.data && <div className="invalid-feedback">{errors.data}</div>}
                                    <div className="form-text">A data não pode ser anterior à data atual.</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Horário da Sessão</label>
                                    <input type="time" className={`form-control ${errors.horario ? 'is-invalid' : ''}`}
                                        value={form.horario} onChange={(e) => setForm({...form, horario: e.target.value})} required />
                                    {errors.horario && <div className="invalid-feedback">{errors.horario}</div>}
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-cinema" disabled={filmes.length === 0 || salas.length === 0}>
                                        <i className="bi bi-check-lg me-2"></i>Salvar Sessão
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
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>Sessões Programadas</h5>
                            <span className="badge bg-primary">{sessoes.length}</span>
                        </div>
                        <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="text-center p-3">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            ) : sessoes.length === 0 ? (
                                <div className="text-center text-muted p-3">
                                    <i className="bi bi-clock display-4 mb-3"></i>
                                    <p>Nenhuma sessão programada.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Filme</th>
                                                <th>Sala</th>
                                                <th>Data/Hora</th>
                                                <th>Vendidos</th>
                                                <th className="text-end">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sessoes.map(sessao => {
                                                const filme = filmes.find(f => f.id === sessao.filmeId);
                                                const sala = salas.find(s => s.id === sessao.salaId);
                                                const qtdVendidos = contarIngressosSessao(sessao.id!);
                                                return (
                                                    <tr key={sessao.id}>
                                                        <td>
                                                            <i className="bi bi-film me-2"></i>
                                                            {filme?.titulo || 'Filme não encontrado'}
                                                        </td>
                                                        <td>
                                                            <i className="bi bi-building me-2"></i>
                                                            Sala {sala?.numero || '?'}
                                                        </td>
                                                        <td>
                                                            <i className="bi bi-calendar me-2"></i>
                                                            {formatDate(sessao.data)} {sessao.horario}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${qtdVendidos > 0 ? 'bg-success' : 'bg-secondary'}`}>
                                                                <i className="bi bi-ticket-perforated me-1"></i>
                                                                {qtdVendidos}/{sala?.capacidade || 0}
                                                            </span>
                                                        </td>
                                                        <td className="text-end">
                                                            <button 
                                                                className="btn btn-sm btn-success me-1" 
                                                                onClick={() => abrirModalVenda(sessao)}
                                                                title="Vender Ingresso">
                                                                <i className="bi bi-ticket-perforated me-1"></i>Vender
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger" 
                                                                onClick={() => sessao.id && handleDelete(sessao.id)}
                                                                title="Excluir Sessão">
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

            {/* Modal de Venda de Ingresso */}
            {showModal && sessaoSelecionada && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-ticket-perforated me-2"></i>Vender Ingresso
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={fecharModal}></button>
                            </div>
                            <div className="modal-body">
                                {/* Info da Sessão */}
                                <div className="alert alert-info">
                                    <strong><i className="bi bi-film me-2"></i>Filme:</strong> {filmes.find(f => f.id === sessaoSelecionada.filmeId)?.titulo}<br />
                                    <strong><i className="bi bi-building me-2"></i>Sala:</strong> {salas.find(s => s.id === sessaoSelecionada.salaId)?.numero}<br />
                                    <strong><i className="bi bi-calendar me-2"></i>Data/Hora:</strong> {formatDate(sessaoSelecionada.data)} às {sessaoSelecionada.horario}
                                </div>

                                {/* Formulário de Venda */}
                                <div className="mb-3">
                                    <label className="form-label">Nome do Cliente (opcional)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Nome do cliente"
                                        value={vendaForm.nomeCliente}
                                        onChange={(e) => setVendaForm({...vendaForm, nomeCliente: e.target.value})}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Tipo de Ingresso</label>
                                    <div className="row">
                                        <div className="col-6">
                                            <div 
                                                className={`card cursor-pointer ${vendaForm.tipo === 'inteira' ? 'border-primary border-2' : ''}`}
                                                onClick={() => setVendaForm({...vendaForm, tipo: 'inteira'})}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="card-body text-center">
                                                    <i className="bi bi-ticket-detailed display-4 text-primary"></i>
                                                    <h5 className="mt-2">Inteira</h5>
                                                    <p className="mb-0 h4 text-success">{formatCurrency(VALOR_INTEIRA)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div 
                                                className={`card cursor-pointer ${vendaForm.tipo === 'meia' ? 'border-primary border-2' : ''}`}
                                                onClick={() => setVendaForm({...vendaForm, tipo: 'meia'})}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="card-body text-center">
                                                    <i className="bi bi-ticket display-4 text-warning"></i>
                                                    <h5 className="mt-2">Meia</h5>
                                                    <p className="mb-0 h4 text-success">{formatCurrency(VALOR_MEIA)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="alert alert-success text-center">
                                    <h5 className="mb-0">
                                        <i className="bi bi-cash me-2"></i>
                                        Valor Final: <strong>{formatCurrency(getValorPorTipo(vendaForm.tipo))}</strong>
                                    </h5>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={fecharModal}>
                                    <i className="bi bi-x-lg me-2"></i>Cancelar
                                </button>
                                <button type="button" className="btn btn-success" onClick={handleVenderIngresso}>
                                    <i className="bi bi-check-lg me-2"></i>Confirmar Venda
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
