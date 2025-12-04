import { useState, useEffect } from 'react';
import { type IFilme, GeneroFilme, GENEROS, CLASSIFICACOES, filmeSchema } from '../../models/filme.model';
import { filmeService } from '../../services/api.service';
import { formatDate } from '../../utils/formatters';
import { Alert } from '../../components/Alert';

export const FilmesPage = () => {
    const [filmes, setFilmes] = useState<IFilme[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Omit<IFilme, 'id'>>({
        titulo: '',
        sinopse: '',
        classificacao: '',
        duracao: 0,
        genero: GeneroFilme.ACAO,
        dataInicialExibicao: '',
        dataFinalExibicao: ''
    });
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        carregarFilmes();
    }, []);

    const carregarFilmes = async () => {
        setLoading(true);
        try {
            const data = await filmeService.findAll();
            setFilmes(data);
        } catch (error) {
            setAlert({ message: 'Erro ao carregar filmes!', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validação com Zod
        const result = filmeSchema.safeParse(form);
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

        if (new Date(form.dataFinalExibicao) < new Date(form.dataInicialExibicao)) {
            setErrors({ dataFinalExibicao: 'A data final deve ser maior que a data inicial!' });
            setAlert({ message: 'A data final deve ser maior que a data inicial!', type: 'danger' });
            return;
        }

        const existente = filmes.find(f => f.titulo.toLowerCase() === form.titulo.toLowerCase());
        if (existente) {
            setErrors({ titulo: 'Já existe um filme cadastrado com este título!' });
            setAlert({ message: 'Já existe um filme cadastrado com este título!', type: 'danger' });
            return;
        }

        try {
            await filmeService.create(form);
            await carregarFilmes();
            limparFormulario();
            setAlert({ message: `Filme "${form.titulo}" salvo com sucesso!`, type: 'success' });
        } catch (error) {
            setAlert({ message: 'Erro ao salvar filme!', type: 'danger' });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Deseja realmente excluir este filme?')) {
            try {
                await filmeService.delete(id);
                await carregarFilmes();
                setAlert({ message: 'Filme excluído com sucesso!', type: 'success' });
            } catch (error) {
                setAlert({ message: 'Erro ao excluir filme!', type: 'danger' });
            }
        }
    };

    const limparFormulario = () => {
        setErrors({});
        setForm({
            titulo: '',
            sinopse: '',
            classificacao: '',
            duracao: 0,
            genero: GeneroFilme.ACAO,
            dataInicialExibicao: '',
            dataFinalExibicao: ''
        });
    };

    // Formatar duração em minutos para exibição
    const formatarDuracao = (minutos: number): string => {
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (horas > 0) {
            return `${horas}h ${mins}min`;
        }
        return `${mins}min`;
    };

    return (
        <div className="container mt-4">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-primary">
                        <i className="bi bi-film me-2"></i>Gerenciamento de Filmes
                    </h2>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-5 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0"><i className="bi bi-plus-circle me-2"></i>Cadastrar Novo Filme</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label required-field">Título</label>
                                    <input type="text" className={`form-control ${errors.titulo ? 'is-invalid' : ''}`} maxLength={100}
                                        value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} required />
                                    {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Sinopse (mínimo 10 caracteres)</label>
                                    <textarea className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`} rows={3} maxLength={1000}
                                        value={form.sinopse} onChange={(e) => setForm({...form, sinopse: e.target.value})} required />
                                    {errors.sinopse && <div className="invalid-feedback">{errors.sinopse}</div>}
                                    <div className="form-text">{form.sinopse.length}/1000 caracteres</div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label required-field">Gênero</label>
                                        <select className={`form-select ${errors.genero ? 'is-invalid' : ''}`} value={form.genero}
                                            onChange={(e) => setForm({...form, genero: e.target.value as GeneroFilme})} required>
                                            {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                        {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label required-field">Classificação</label>
                                        <select className={`form-select ${errors.classificacao ? 'is-invalid' : ''}`} value={form.classificacao}
                                            onChange={(e) => setForm({...form, classificacao: e.target.value})} required>
                                            <option value="">Selecione</option>
                                            {CLASSIFICACOES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        {errors.classificacao && <div className="invalid-feedback">{errors.classificacao}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label required-field">Duração (minutos)</label>
                                    <input type="number" className={`form-control ${errors.duracao ? 'is-invalid' : ''}`} min={1} max={600}
                                        value={form.duracao || ''} 
                                        onChange={(e) => setForm({...form, duracao: parseInt(e.target.value) || 0})} required />
                                    {errors.duracao && <div className="invalid-feedback">{errors.duracao}</div>}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label required-field">Data Inicial Exibição</label>
                                        <input type="date" className={`form-control ${errors.dataInicialExibicao ? 'is-invalid' : ''}`} value={form.dataInicialExibicao}
                                            onChange={(e) => setForm({...form, dataInicialExibicao: e.target.value})} required />
                                        {errors.dataInicialExibicao && <div className="invalid-feedback">{errors.dataInicialExibicao}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label required-field">Data Final Exibição</label>
                                        <input type="date" className={`form-control ${errors.dataFinalExibicao ? 'is-invalid' : ''}`} value={form.dataFinalExibicao}
                                            onChange={(e) => setForm({...form, dataFinalExibicao: e.target.value})} required />
                                        {errors.dataFinalExibicao && <div className="invalid-feedback">{errors.dataFinalExibicao}</div>}
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-cinema">
                                        <i className="bi bi-check-lg me-2"></i>Salvar Filme
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
                            <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>Filmes Cadastrados</h5>
                            <span className="badge bg-primary">{filmes.length}</span>
                        </div>
                        <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="text-center p-3">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            ) : filmes.length === 0 ? (
                                <div className="text-center text-muted p-3">
                                    <i className="bi bi-film display-4 mb-3"></i>
                                    <p>Nenhum filme cadastrado.</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {filmes.map(filme => (
                                        <div key={filme.id} className="col-md-6 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <h6 className="card-title mb-1">{filme.titulo}</h6>
                                                        <button className="btn btn-sm btn-outline-danger" 
                                                            onClick={() => filme.id && handleDelete(filme.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                    <p className="card-text small text-muted mb-2" style={{ 
                                                        maxHeight: '60px', 
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {filme.sinopse}
                                                    </p>
                                                    <div className="small">
                                                        <span className="badge bg-secondary me-1">{filme.genero}</span>
                                                        <span className="badge bg-info me-1">{filme.classificacao}</span>
                                                        <span className="badge bg-dark">{formatarDuracao(filme.duracao)}</span>
                                                    </div>
                                                    <p className="mb-0 mt-2 small text-muted">
                                                        <i className="bi bi-calendar me-1"></i>
                                                        {formatDate(filme.dataInicialExibicao)} - {formatDate(filme.dataFinalExibicao)}
                                                    </p>
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
