import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type IPedidoBase, adicionarIngresso, adicionarLanche, removerIngresso, removerLanche, calcularTotal } from '../../models/pedido.model';
import { type IIngresso } from '../../models/ingresso.model';
import { type ILancheCombo, calcularSubtotal } from '../../models/lancheCombo.model';
import { type ISessao } from '../../models/sessao.model';
import { type IFilme } from '../../models/filme.model';
import { type ISala } from '../../models/sala.model';
import { pedidoService, ingressoService, lancheComboService, sessaoService, filmeService, salaService } from '../../services/api.service';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Alert } from '../../components/Alert';

export const PedidosPage = () => {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [ingressos, setIngressos] = useState<IIngresso[]>([]);
    const [lanches, setLanches] = useState<ILancheCombo[]>([]);
    const [sessoes, setSessoes] = useState<ISessao[]>([]);
    const [filmes, setFilmes] = useState<IFilme[]>([]);
    const [salas, setSalas] = useState<ISala[]>([]);
    const [loading, setLoading] = useState(false);

    const [pedidoAtual, setPedidoAtual] = useState<IPedidoBase>({
        qtInteira: 0,
        qtMeia: 0,
        ingresso: [],
        lanche: [],
        valorTotal: 0
    });

    const [ingressoSelecionado, setIngressoSelecionado] = useState(0);
    const [lancheSelecionado, setLancheSelecionado] = useState(0);
    const [qtLanche, setQtLanche] = useState(1);

    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [filmesData, salasData, sessoesData, ingressosData, lanchesData, pedidosData] = await Promise.all([
                filmeService.findAll(),
                salaService.findAll(),
                sessaoService.findAll(),
                ingressoService.findAll(),
                lancheComboService.findAll(),
                pedidoService.findAll()
            ]);
            setFilmes(filmesData);
            setSalas(salasData);
            setSessoes(sessoesData);
            setIngressos(ingressosData);
            setLanches(lanchesData);
            setPedidos(pedidosData);
        } catch (error) {
            setAlert({ message: 'Erro ao carregar dados!', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdicionarIngresso = (tipo: 'inteira' | 'meia') => {
        if (!ingressoSelecionado) {
            setAlert({ message: 'Selecione uma sessão!', type: 'danger' });
            return;
        }

        const ingresso = ingressos.find(i => i.id === ingressoSelecionado);
        if (!ingresso) return;

        const novoIngresso: IIngresso = {
            ...ingresso,
            id: Date.now()
        };

        let novoPedido = adicionarIngresso(pedidoAtual, novoIngresso);
        
        if (tipo === 'inteira') {
            novoPedido = { ...novoPedido, qtInteira: novoPedido.qtInteira + 1 };
        } else {
            novoPedido = { ...novoPedido, qtMeia: novoPedido.qtMeia + 1 };
        }

        novoPedido = calcularTotal(novoPedido);
        setPedidoAtual(novoPedido);
    };

    const handleAdicionarLanche = () => {
        if (!lancheSelecionado || qtLanche <= 0) {
            setAlert({ message: 'Selecione um lanche e quantidade!', type: 'danger' });
            return;
        }

        const lanche = lanches.find(l => l.id === lancheSelecionado);
        if (!lanche) return;

        const novoLanche: ILancheCombo = {
            ...lanche,
            id: Date.now(),
            qtUnidade: qtLanche,
            subtotal: calcularSubtotal(lanche.valorUnitario, qtLanche)
        };

        let novoPedido = adicionarLanche(pedidoAtual, novoLanche);
        novoPedido = calcularTotal(novoPedido);
        setPedidoAtual(novoPedido);
        setLancheSelecionado(0);
        setQtLanche(1);
    };

    const handleRemoverIngresso = (index: number) => {
        let novoPedido = removerIngresso(pedidoAtual, index);
        if (pedidoAtual.qtInteira > 0) {
            novoPedido = { ...novoPedido, qtInteira: novoPedido.qtInteira - 1 };
        } else if (pedidoAtual.qtMeia > 0) {
            novoPedido = { ...novoPedido, qtMeia: novoPedido.qtMeia - 1 };
        }
        novoPedido = calcularTotal(novoPedido);
        setPedidoAtual(novoPedido);
    };

    const handleRemoverLanche = (index: number) => {
        let novoPedido = removerLanche(pedidoAtual, index);
        novoPedido = calcularTotal(novoPedido);
        setPedidoAtual(novoPedido);
    };

    const handleFinalizarPedido = async () => {
        if (pedidoAtual.ingresso.length === 0 && pedidoAtual.lanche.length === 0) {
            setAlert({ message: 'Adicione pelo menos um item ao pedido!', type: 'danger' });
            return;
        }

        try {
            await pedidoService.create(pedidoAtual);
            await carregarDados();
            limparPedido();
            setAlert({ message: 'Pedido finalizado com sucesso!', type: 'success' });
        } catch (error) {
            setAlert({ message: 'Erro ao finalizar pedido!', type: 'danger' });
        }
    };

    const limparPedido = () => {
        setPedidoAtual({
            qtInteira: 0,
            qtMeia: 0,
            ingresso: [],
            lanche: [],
            valorTotal: 0
        });
        setIngressoSelecionado(0);
        setLancheSelecionado(0);
        setQtLanche(1);
    };

    const handleDeletePedido = async (id: number) => {
        if (confirm('Excluir este pedido?')) {
            try {
                await pedidoService.delete(id);
                await carregarDados();
                setAlert({ message: 'Pedido excluído!', type: 'success' });
            } catch (error) {
                setAlert({ message: 'Erro ao excluir pedido!', type: 'danger' });
            }
        }
    };

    const getInfoSessao = (sessaoId: number) => {
        const sessao = sessoes.find(s => s.id === sessaoId);
        const filme = sessao ? filmes.find(f => f.id === sessao.filmeId) : null;
        const sala = sessao ? salas.find(s => s.id === sessao.salaId) : null;
        return { sessao, filme, sala };
    };

    return (
        <div className="container mt-4">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-success">
                        <i className="bi bi-cart me-2"></i>Realização de Pedidos
                    </h2>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-7 mb-4">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0"><i className="bi bi-cart-plus me-2"></i>Novo Pedido</h5>
                        </div>
                        <div className="card-body">
                            <h6 className="border-bottom pb-2 mb-3">
                                <i className="bi bi-ticket-perforated me-2"></i>Ingressos
                            </h6>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Sessão</label>
                                    <select className="form-select" value={ingressoSelecionado}
                                        onChange={(e) => setIngressoSelecionado(parseInt(e.target.value))}>
                                        <option value={0}>Selecione</option>
                                        {ingressos.map(ing => {
                                            const { sessao, filme, sala } = getInfoSessao(ing.sessaoId);
                                            if (!sessao) return null;
                                            return (
                                                <option key={ing.id} value={ing.id}>
                                                    {filme?.titulo} - Sala {sala?.numero} - {formatDate(sessao.data)} {sessao.horario}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">&nbsp;</label>
                                    <div className="d-flex gap-2">
                                        <button type="button" className="btn btn-primary flex-fill" onClick={() => handleAdicionarIngresso('inteira')}>
                                            <i className="bi bi-plus me-1"></i>Inteira
                                        </button>
                                        <button type="button" className="btn btn-success flex-fill" onClick={() => handleAdicionarIngresso('meia')}>
                                            <i className="bi bi-plus me-1"></i>Meia
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {ingressos.length === 0 && (
                                <div className="alert alert-info">
                                    <Link to="/ingressos">Configure ingressos primeiro</Link>
                                </div>
                            )}

                            <h6 className="border-bottom pb-2 mb-3 mt-4">
                                <i className="bi bi-cup-straw me-2"></i>Lanches e Combos
                            </h6>
                            <div className="row mb-3">
                                <div className="col-md-5">
                                    <label className="form-label">Lanche/Combo</label>
                                    <select className="form-select" value={lancheSelecionado}
                                        onChange={(e) => setLancheSelecionado(parseInt(e.target.value))}>
                                        <option value={0}>Selecione</option>
                                        {lanches.map(l => (
                                            <option key={l.id} value={l.id}>{l.nome} - {formatCurrency(l.valorUnitario)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Qtd</label>
                                    <input type="number" className="form-control" min={1} max={10}
                                        value={qtLanche} onChange={(e) => setQtLanche(parseInt(e.target.value) || 1)} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">&nbsp;</label>
                                    <button type="button" className="btn btn-warning w-100" onClick={handleAdicionarLanche}>
                                        <i className="bi bi-plus me-1"></i>Adicionar
                                    </button>
                                </div>
                            </div>
                            {lanches.length === 0 && (
                                <div className="alert alert-info">
                                    <Link to="/lanches">Cadastre lanches primeiro</Link>
                                </div>
                            )}

                            <h6 className="border-bottom pb-2 mb-3 mt-4">
                                <i className="bi bi-receipt me-2"></i>Resumo do Pedido
                            </h6>
                            
                            {pedidoAtual.ingresso.length === 0 && pedidoAtual.lanche.length === 0 ? (
                                <p className="text-muted text-center">Nenhum item adicionado</p>
                            ) : (
                                <>
                                    {pedidoAtual.ingresso.map((ing, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                                            <span>
                                                <i className="bi bi-ticket me-2"></i>
                                                Ingresso - {formatCurrency(ing.valorInteira)}
                                            </span>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoverIngresso(idx)}>
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {pedidoAtual.lanche.map((lan, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                                            <span>
                                                <i className="bi bi-cup-straw me-2"></i>
                                                {lan.nome} x{lan.qtUnidade} - {formatCurrency(lan.subtotal)}
                                            </span>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoverLanche(idx)}>
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    ))}
                                </>
                            )}

                            <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-success text-white rounded">
                                <h5 className="mb-0">TOTAL:</h5>
                                <h4 className="mb-0">{formatCurrency(pedidoAtual.valorTotal)}</h4>
                            </div>

                            <div className="d-grid gap-2 mt-3">
                                <button type="button" className="btn btn-success btn-lg" onClick={handleFinalizarPedido}>
                                    <i className="bi bi-check-circle me-2"></i>Finalizar Pedido
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={limparPedido}>
                                    <i className="bi bi-x-circle me-2"></i>Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5 mb-4">
                    <div className="card">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>Pedidos Realizados</h5>
                            <span className="badge bg-light text-success">{pedidos.length}</span>
                        </div>
                        <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="text-center p-3">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </div>
                            ) : pedidos.length === 0 ? (
                                <div className="text-center text-muted p-3">
                                    <i className="bi bi-cart display-4 mb-3"></i>
                                    <p>Nenhum pedido realizado.</p>
                                </div>
                            ) : (
                                pedidos.map(pedido => (
                                    <div key={pedido.id} className="card mb-2">
                                        <div className="card-body p-3">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h6 className="mb-1">Pedido #{pedido.id}</h6>
                                                    <p className="mb-1 small">
                                                        <i className="bi bi-ticket me-1"></i>
                                                        {pedido.qtInteira} inteira(s) | {pedido.qtMeia} meia(s)
                                                    </p>
                                                    <p className="mb-1 small">
                                                        <i className="bi bi-cup-straw me-1"></i>
                                                        {pedido.lanche?.length || 0} lanche(s)
                                                    </p>
                                                    <h6 className="text-success mb-0">
                                                        {formatCurrency(pedido.valorTotal)}
                                                    </h6>
                                                </div>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePedido(pedido.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
