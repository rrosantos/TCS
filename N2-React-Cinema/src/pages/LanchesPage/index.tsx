import { useState, useEffect } from 'react';
import { type ILancheCombo } from '../../models/lancheCombo.model';
import { lancheComboService } from '../../services/api.service';
import { formatCurrency } from '../../utils/formatters';
import { Alert } from '../../components/Alert';

export const LanchesPage = () => {
    const [lanches, setLanches] = useState<ILancheCombo[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        valorUnitario: 0
    });
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

    useEffect(() => {
        carregarLanches();
    }, []);

    const carregarLanches = async () => {
        setLoading(true);
        try {
            const data = await lancheComboService.findAll();
            setLanches(data);
        } catch (error) {
            setAlert({ message: 'Erro ao carregar lanches!', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.nome || !form.descricao || form.valorUnitario <= 0) {
            setAlert({ message: 'Todos os campos são obrigatórios!', type: 'danger' });
            return;
        }

        const existente = lanches.find(l => l.nome.toLowerCase() === form.nome.toLowerCase());
        if (existente) {
            setAlert({ message: 'Já existe um lanche/combo com este nome!', type: 'danger' });
            return;
        }

        const novoLanche: Omit<ILancheCombo, 'id'> = {
            nome: form.nome,
            descricao: form.descricao,
            valorUnitario: form.valorUnitario,
            qtUnidade: 0,
            subtotal: 0
        };

        try {
            await lancheComboService.create(novoLanche);
            await carregarLanches();
            limparFormulario();
            setAlert({ message: `Lanche/Combo "${form.nome}" cadastrado!`, type: 'success' });
        } catch (error) {
            setAlert({ message: 'Erro ao criar lanche!', type: 'danger' });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Deseja excluir este lanche/combo?')) {
            try {
                await lancheComboService.delete(id);
                await carregarLanches();
                setAlert({ message: 'Lanche/Combo excluído!', type: 'success' });
            } catch (error) {
                setAlert({ message: 'Erro ao excluir lanche!', type: 'danger' });
            }
        }
    };

    const limparFormulario = () => {
        setForm({ nome: '', descricao: '', valorUnitario: 0 });
    };

    return (
        <div className="container mt-4">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-warning">
                        <i className="bi bi-cup-straw me-2"></i>Gerenciamento de Lanches e Combos
                    </h2>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-5 mb-4">
                    <div className="card">
                        <div className="card-header bg-warning">
                            <h5 className="mb-0"><i className="bi bi-plus-circle me-2"></i>Cadastrar Lanche/Combo</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label required-field">Nome</label>
                                    <input type="text" className="form-control" maxLength={100}
                                        value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Descrição</label>
                                    <textarea className="form-control" rows={3} maxLength={500}
                                        value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Valor Unitário (R$)</label>
                                    <input type="number" className="form-control" min={0.01} step={0.01}
                                        value={form.valorUnitario || ''} onChange={(e) => setForm({...form, valorUnitario: parseFloat(e.target.value) || 0})} required />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-warning">
                                        <i className="bi bi-check-lg me-2"></i>Salvar Lanche/Combo
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
                        <div className="card-header bg-warning d-flex justify-content-between align-items-center">
                            <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>Lanches e Combos</h5>
                            <span className="badge bg-dark">{lanches.length}</span>
                        </div>
                        <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="text-center p-3">
                                    <div className="spinner-border text-warning" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            ) : lanches.length === 0 ? (
                                <div className="text-center text-muted p-3">
                                    <i className="bi bi-cup-straw display-4 mb-3"></i>
                                    <p>Nenhum lanche/combo cadastrado.</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {lanches.map(lanche => (
                                        <div key={lanche.id} className="col-md-6 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className="card-title">{lanche.nome}</h6>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => lanche.id && handleDelete(lanche.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                    <p className="card-text small text-muted">{lanche.descricao}</p>
                                                    <h5 className="text-success mb-0">
                                                        {formatCurrency(lanche.valorUnitario)}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
