import { useState, useEffect } from 'react';
import { type ISessao } from '../../models/sessao.model';
import { type IFilme } from '../../models/filme.model';
import { type ISala } from '../../models/sala.model';
import { type IIngresso, VALOR_INTEIRA, VALOR_MEIA } from '../../models/ingresso.model';
import { sessaoService, filmeService, salaService, ingressoService } from '../../services/api.service';
import { formatCurrency } from '../../utils/formatters';

export const ProgramacaoPage = () => {
    const [sessoes, setSessoes] = useState<ISessao[]>([]);
    const [filmes, setFilmes] = useState<IFilme[]>([]);
    const [salas, setSalas] = useState<ISala[]>([]);
    const [ingressos, setIngressos] = useState<IIngresso[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtroData, setFiltroData] = useState('');

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
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const sessoesFuturas = sessoes
        .filter(s => new Date(`${s.data}T${s.horario}`) >= new Date())
        .filter(s => !filtroData || s.data === filtroData)
        .sort((a, b) => new Date(`${a.data}T${a.horario}`).getTime() - new Date(`${b.data}T${b.horario}`).getTime());

    const sessoesAgrupadas = sessoesFuturas.reduce((acc, sessao) => {
        const data = sessao.data;
        if (!acc[data]) acc[data] = [];
        acc[data].push(sessao);
        return acc;
    }, {} as Record<string, ISessao[]>);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-primary">
                        <i className="bi bi-calendar-week me-2"></i>Programação do Cinema
                    </h2>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <label className="form-label">Filtrar por data</label>
                    <input type="date" className="form-control" value={filtroData}
                        onChange={(e) => setFiltroData(e.target.value)} />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                    {filtroData && (
                        <button className="btn btn-outline-secondary" onClick={() => setFiltroData('')}>
                            <i className="bi bi-x me-1"></i>Limpar filtro
                        </button>
                    )}
                </div>
            </div>

            {Object.keys(sessoesAgrupadas).length === 0 ? (
                <div className="text-center text-muted py-5">
                    <i className="bi bi-calendar-x display-1 mb-3"></i>
                    <h4>Nenhuma sessão programada</h4>
                    <p>Não há sessões futuras para exibir.</p>
                </div>
            ) : (
                Object.entries(sessoesAgrupadas).map(([data, sessoesData]) => (
                    <div key={data} className="mb-4">
                        <h4 className="mb-3 border-bottom pb-2">
                            <i className="bi bi-calendar-event me-2"></i>
                            {new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </h4>
                        <div className="row">
                            {sessoesData.map(sessao => {
                                const filme = filmes.find(f => f.id === sessao.filmeId);
                                const sala = salas.find(s => s.id === sessao.salaId);
                                const ingressosVendidos = ingressos.filter(i => i.sessaoId === sessao.id).length;

                                return (
                                    <div key={sessao.id} className="col-lg-4 col-md-6 mb-3">
                                        <div className="card h-100 shadow-sm">
                                            <div className="card-header bg-primary text-white">
                                                <h5 className="mb-0">{filme?.titulo || 'Filme não encontrado'}</h5>
                                            </div>
                                            <div className="card-body">
                                                <p className="mb-2">
                                                    <i className="bi bi-clock me-2 text-primary"></i>
                                                    <strong>{sessao.horario}</strong>
                                                </p>
                                                <p className="mb-2">
                                                    <i className="bi bi-building me-2 text-primary"></i>
                                                    Sala {sala?.numero || '?'} ({sala?.capacidade || 0} lugares)
                                                </p>
                                                <p className="mb-2">
                                                    <i className="bi bi-hourglass me-2 text-primary"></i>
                                                    Duração: {filme?.duracao || 'N/A'} min
                                                </p>
                                                <p className="mb-2">
                                                    <i className="bi bi-tag me-2 text-primary"></i>
                                                    {filme?.genero || 'N/A'} | {filme?.classificacao || 'N/A'}
                                                </p>
                                                <p className="mb-2">
                                                    <i className="bi bi-ticket-perforated me-2 text-primary"></i>
                                                    Vendidos: <span className="badge bg-success">{ingressosVendidos}/{sala?.capacidade || 0}</span>
                                                </p>
                                                <div className="mt-3">
                                                    <span className="badge bg-primary me-2">
                                                        Inteira: {formatCurrency(VALOR_INTEIRA)}
                                                    </span>
                                                    <span className="badge bg-success">
                                                        Meia: {formatCurrency(VALOR_MEIA)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
