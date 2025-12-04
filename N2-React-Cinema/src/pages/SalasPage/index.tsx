import { useState, useEffect } from 'react';
import { type ISala, salaSchema } from '../../models/sala.model';
import { salaService } from '../../services/api.service';
import { Alert } from '../../components/Alert';

export const SalasPage = () => {
    const [salas, setSalas] = useState<ISala[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        numero: 0,
        capacidade: 0
    });
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        carregarSalas();
    }, []);

    const carregarSalas = async () => {
        setLoading(true);
        try {
            const data = await salaService.findAll();
            setSalas(data);
        } catch (error) {
            setAlert({ message: 'Erro ao carregar salas!', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validação com Zod
        const result = salaSchema.safeParse(form);
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

        const existente = salas.find(s => s.numero === form.numero);
        if (existente) {
            setErrors({ numero: 'Já existe uma sala com este número!' });
            setAlert({ message: 'Já existe uma sala com este número!', type: 'danger' });
            return;
        }

        const novaSala: Omit<ISala, 'id'> = {
            numero: form.numero,
            capacidade: form.capacidade
        };

        try {
            await salaService.create(novaSala);
            await carregarSalas();
            limparFormulario();
            setAlert({ message: `Sala ${form.numero} criada com ${form.capacidade} lugares!`, type: 'success' });
        } catch (error) {
            setAlert({ message: 'Erro ao criar sala!', type: 'danger' });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Deseja realmente excluir esta sala?')) {
            try {
                await salaService.delete(id);
                await carregarSalas();
                setAlert({ message: 'Sala excluída com sucesso!', type: 'success' });
            } catch (error) {
                setAlert({ message: 'Erro ao excluir sala!', type: 'danger' });
            }
        }
    };

    const limparFormulario = () => {
        setErrors({});
        setForm({ numero: 0, capacidade: 0 });
    };

    return (
        <div className="container mt-4">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-primary">
                        <i className="bi bi-building me-2"></i>Gerenciamento de Salas
                    </h2>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-5 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0"><i className="bi bi-plus-circle me-2"></i>Cadastrar Nova Sala</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label required-field">Número da Sala</label>
                                    <input type="number" className={`form-control ${errors.numero ? 'is-invalid' : ''}`} min={1}
                                        value={form.numero || ''} 
                                        onChange={(e) => setForm({...form, numero: parseInt(e.target.value) || 0})} 
                                        required />
                                    {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Capacidade Máxima</label>
                                    <input type="number" className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`} min={1} max={1000}
                                        value={form.capacidade || ''} 
                                        onChange={(e) => setForm({...form, capacidade: parseInt(e.target.value) || 0})} 
                                        required />
                                    {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
                                    <div className="form-text">Número máximo de pessoas na sala.</div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-cinema">
                                        <i className="bi bi-check-lg me-2"></i>Salvar Sala
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
                            <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>Salas Cadastradas</h5>
                            <span className="badge bg-primary">{salas.length}</span>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center p-3">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            ) : salas.length === 0 ? (
                                <div className="text-center text-muted p-3">
                                    <i className="bi bi-building display-4 mb-3"></i>
                                    <p>Nenhuma sala cadastrada.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Número</th>
                                                <th>Capacidade</th>
                                                <th className="text-end">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {salas.map(sala => (
                                                <tr key={sala.id}>
                                                    <td>
                                                        <i className="bi bi-door-open me-2"></i>
                                                        Sala {sala.numero}
                                                    </td>
                                                    <td>
                                                        <i className="bi bi-people me-2"></i>
                                                        {sala.capacidade} lugares
                                                    </td>
                                                    <td className="text-end">
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger" 
                                                            onClick={() => sala.id && handleDelete(sala.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
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

