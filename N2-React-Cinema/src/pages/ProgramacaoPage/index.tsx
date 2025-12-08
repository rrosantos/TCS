import { useState, useEffect } from "react";
import { type ISessao } from "../../models/sessao.model";
import { type IFilme } from "../../models/filme.model";
import { type ISala } from "../../models/sala.model";
import {
  type IIngresso,
  type TipoIngresso,
  VALOR_INTEIRA,
  VALOR_MEIA,
  getValorPorTipo,
} from "../../models/ingresso.model";
import { type ILanche, type IPedidoLanche } from "../../models/lanche.model";
import {
  sessaoService,
  filmeService,
  salaService,
  ingressoService,
  lancheService,
  pedidoLancheService,
} from "../../services/api.service";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  PageHeader,
  FormInput,
  Loading,
  EmptyState,
  Badge,
  Modal,
} from "../../components";

export const ProgramacaoPage = () => {
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [ingressos, setIngressos] = useState<IIngresso[]>([]);
  const [lanches, setLanches] = useState<ILanche[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroData, setFiltroData] = useState("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  // Estado do modal de venda
  const [showModal, setShowModal] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<ISessao | null>(
    null
  );
  const [vendaForm, setVendaForm] = useState({
    tipo: "inteira" as TipoIngresso,
    nomeCliente: "",
  });

  // Estado dos lanches selecionados
  const [lanchesSelecionados, setLanchesSelecionados] = useState<{
    [lancheId: number]: number;
  }>({});

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [filmesData, salasData, sessoesData, ingressosData, lanchesData] =
        await Promise.all([
          filmeService.findAll(),
          salaService.findAll(),
          sessaoService.findAll(),
          ingressoService.findAll(),
          lancheService.findAll(),
        ]);
      setFilmes(filmesData);
      setSalas(salasData);
      setSessoes(sessoesData);
      setIngressos(ingressosData);
      setLanches(lanchesData.filter((l: ILanche) => l.disponivel));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funções do modal de venda
  const abrirModalVenda = (sessao: ISessao) => {
    setSessaoSelecionada(sessao);
    setVendaForm({ tipo: "inteira", nomeCliente: "" });
    setLanchesSelecionados({});
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setSessaoSelecionada(null);
    setVendaForm({ tipo: "inteira", nomeCliente: "" });
    setLanchesSelecionados({});
  };

  // Funções para gerenciar lanches
  const adicionarLanche = (lancheId: number) => {
    setLanchesSelecionados((prev) => ({
      ...prev,
      [lancheId]: (prev[lancheId] || 0) + 1,
    }));
  };

  const removerLanche = (lancheId: number) => {
    setLanchesSelecionados((prev) => {
      const novaQtd = (prev[lancheId] || 0) - 1;
      if (novaQtd <= 0) {
        const { [lancheId]: _, ...resto } = prev;
        return resto;
      }
      return { ...prev, [lancheId]: novaQtd };
    });
  };

  const calcularTotalLanches = () => {
    return Object.entries(lanchesSelecionados).reduce(
      (total, [lancheId, qtd]) => {
        const lanche = lanches.find((l) => l.id === Number(lancheId));
        return total + (lanche?.preco || 0) * qtd;
      },
      0
    );
  };

  const calcularValorTotal = () => {
    return getValorPorTipo(vendaForm.tipo) + calcularTotalLanches();
  };

  const handleVenderIngresso = async () => {
    if (!sessaoSelecionada?.id) return;

    const novoIngresso: Omit<IIngresso, "id"> = {
      sessaoId: sessaoSelecionada.id,
      tipo: vendaForm.tipo,
      valorUnitario: getValorPorTipo(vendaForm.tipo),
      dataVenda: new Date().toISOString().slice(0, 10),
      nomeCliente: vendaForm.nomeCliente || undefined,
    };

    try {
      // Criar o ingresso
      await ingressoService.create(novoIngresso);

      // Criar pedidos de lanches se houver
      const pedidosLanches = Object.entries(lanchesSelecionados).map(
        ([lancheId, quantidade]) => {
          const lanche = lanches.find((l) => l.id === Number(lancheId));
          const pedido: Omit<IPedidoLanche, "id"> = {
            lancheId: Number(lancheId),
            quantidade,
            valorUnitario: lanche?.preco || 0,
            valorTotal: (lanche?.preco || 0) * quantidade,
            dataPedido: new Date().toISOString().slice(0, 10),
            nomeCliente: vendaForm.nomeCliente || undefined,
          };
          return pedidoLancheService.create(pedido);
        }
      );

      await Promise.all(pedidosLanches);
      await carregarDados();
      fecharModal();

      const filme = filmes.find((f) => f.id === sessaoSelecionada.filmeId);
      const totalLanches = calcularTotalLanches();
      const mensagem =
        totalLanches > 0
          ? `Ingresso + Lanches vendidos para "${
              filme?.titulo
            }" - ${formatCurrency(calcularValorTotal())}`
          : `Ingresso ${vendaForm.tipo} vendido para "${
              filme?.titulo
            }" - ${formatCurrency(novoIngresso.valorUnitario)}`;

      setAlert({
        message: mensagem,
        type: "success",
      });
    } catch {
      setAlert({ message: "Erro ao processar compra!", type: "danger" });
    }
  };

  const sessoesFuturas = sessoes
    .filter((s) => new Date(`${s.data}T${s.horario}`) >= new Date())
    .filter((s) => !filtroData || s.data === filtroData)
    .sort(
      (a, b) =>
        new Date(`${a.data}T${a.horario}`).getTime() -
        new Date(`${b.data}T${b.horario}`).getTime()
    );

  const sessoesAgrupadas = sessoesFuturas.reduce((acc, sessao) => {
    const data = sessao.data;
    if (!acc[data]) acc[data] = [];
    acc[data].push(sessao);
    return acc;
  }, {} as Record<string, ISessao[]>);

  if (loading) {
    return (
      <Container>
        <Loading fullPage />
      </Container>
    );
  }

  return (
    <Container>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <PageHeader title="Programação do Cinema" icon="calendar-week" />

      <div className="row mb-4">
        <div className="col-md-4">
          <FormInput
            label="Filtrar por data"
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          {filtroData && (
            <Button
              variant="outline-secondary"
              icon="x"
              onClick={() => setFiltroData("")}
            >
              Limpar filtro
            </Button>
          )}
        </div>
      </div>

      {Object.keys(sessoesAgrupadas).length === 0 ? (
        <EmptyState
          icon="calendar-x"
          title="Nenhuma sessão programada"
          description="Não há sessões futuras para exibir."
        />
      ) : (
        Object.entries(sessoesAgrupadas).map(([data, sessoesData]) => (
          <div key={data} className="mb-4">
            <h4 className="mb-3 border-bottom pb-2">
              <i className="bi bi-calendar-event me-2"></i>
              {new Date(data + "T12:00:00").toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h4>
            <div className="row">
              {sessoesData.map((sessao) => {
                const filme = filmes.find((f) => f.id === sessao.filmeId);
                const sala = salas.find((s) => s.id === sessao.salaId);
                const ingressosVendidos = ingressos.filter(
                  (i) => i.sessaoId === sessao.id
                ).length;

                return (
                  <div key={sessao.id} className="col-lg-4 col-md-6 mb-3">
                    <Card shadow className="h-100">
                      <CardHeader variant="primary">
                        {filme?.titulo || "Filme não encontrado"}
                      </CardHeader>
                      <CardBody>
                        <p className="mb-2">
                          <i className="bi bi-clock me-2 text-primary"></i>
                          <strong>{sessao.horario}</strong>
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-building me-2 text-primary"></i>
                          Sala {sala?.numero || "?"} ({sala?.capacidade || 0}{" "}
                          lugares)
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-hourglass me-2 text-primary"></i>
                          Duração: {filme?.duracao || "N/A"} min
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-tag me-2 text-primary"></i>
                          {filme?.genero || "N/A"} |{" "}
                          {filme?.classificacao || "N/A"}
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-ticket-perforated me-2 text-primary"></i>
                          Vendidos:{" "}
                          <Badge variant="success">
                            {ingressosVendidos}/{sala?.capacidade || 0}
                          </Badge>
                        </p>
                        <div className="mt-3">
                          <Badge variant="primary" className="me-2">
                            Inteira: {formatCurrency(VALOR_INTEIRA)}
                          </Badge>
                          <Badge variant="success">
                            Meia: {formatCurrency(VALOR_MEIA)}
                          </Badge>
                        </div>
                        <div className="mt-3 d-grid">
                          <Button
                            variant="success"
                            icon="ticket-perforated"
                            onClick={() => abrirModalVenda(sessao)}
                            disabled={
                              ingressosVendidos >= (sala?.capacidade || 0)
                            }
                          >
                            {ingressosVendidos >= (sala?.capacidade || 0)
                              ? "Esgotado"
                              : "Comprar Ingresso"}
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Modal de Venda de Ingresso */}
      <Modal
        show={showModal}
        onClose={fecharModal}
        title="Comprar Ingresso"
        icon="ticket-perforated"
        footer={
          <>
            <Button variant="secondary" icon="x-lg" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button
              variant="success"
              icon="check-lg"
              onClick={handleVenderIngresso}
            >
              Confirmar Compra
            </Button>
          </>
        }
      >
        {sessaoSelecionada && (
          <>
            {/* Info da Sessão */}
            <Alert
              type="info"
              autoClose={false}
              dismissible={false}
              message={
                <>
                  <strong>
                    <i className="bi bi-film me-2"></i>Filme:
                  </strong>{" "}
                  {
                    filmes.find((f) => f.id === sessaoSelecionada.filmeId)
                      ?.titulo
                  }
                  <br />
                  <strong>
                    <i className="bi bi-building me-2"></i>Sala:
                  </strong>{" "}
                  {salas.find((s) => s.id === sessaoSelecionada.salaId)?.numero}
                  <br />
                  <strong>
                    <i className="bi bi-calendar me-2"></i>Data/Hora:
                  </strong>{" "}
                  {formatDate(sessaoSelecionada.data)} às{" "}
                  {sessaoSelecionada.horario}
                </>
              }
            />

            {/* Formulário de Venda */}
            <div className="mb-3">
              <label className="form-label">Nome do Cliente (opcional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nome do cliente"
                value={vendaForm.nomeCliente}
                onChange={(e) =>
                  setVendaForm({ ...vendaForm, nomeCliente: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label required-field">
                Tipo de Ingresso
              </label>
              <div className="row">
                <div className="col-6">
                  <Card
                    border={
                      vendaForm.tipo === "inteira" ? "primary" : undefined
                    }
                    className={vendaForm.tipo === "inteira" ? "border-2" : ""}
                  >
                    <CardBody
                      className="text-center"
                      onClick={() =>
                        setVendaForm({ ...vendaForm, tipo: "inteira" })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <i className="bi bi-ticket-detailed display-4 text-primary"></i>
                      <h5 className="mt-2">Inteira</h5>
                      <p className="mb-0 h4 text-success">
                        {formatCurrency(VALOR_INTEIRA)}
                      </p>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-6">
                  <Card
                    border={vendaForm.tipo === "meia" ? "primary" : undefined}
                    className={vendaForm.tipo === "meia" ? "border-2" : ""}
                  >
                    <CardBody
                      className="text-center"
                      onClick={() =>
                        setVendaForm({ ...vendaForm, tipo: "meia" })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <i className="bi bi-ticket display-4 text-warning"></i>
                      <h5 className="mt-2">Meia</h5>
                      <p className="mb-0 h4 text-success">
                        {formatCurrency(VALOR_MEIA)}
                      </p>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>

            {/* Seção de Lanches */}
            {lanches.length > 0 && (
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-cup-straw me-2"></i>
                  Adicionar Lanches (opcional)
                </label>
                <div
                  className="border rounded p-2"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {lanches.map((lanche) => {
                    const qtd = lanchesSelecionados[lanche.id!] || 0;
                    return (
                      <div
                        key={lanche.id}
                        className="d-flex justify-content-between align-items-center py-2 border-bottom"
                      >
                        <div className="flex-grow-1">
                          <strong>{lanche.nome}</strong>
                          <small className="text-muted d-block">
                            {lanche.categoria}{" "}
                            {lanche.tamanho ? `- ${lanche.tamanho}` : ""}
                          </small>
                        </div>
                        <div className="text-end me-3">
                          <span className="text-success fw-bold">
                            {formatCurrency(lanche.preco)}
                          </span>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removerLanche(lanche.id!)}
                            disabled={qtd === 0}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span
                            className="btn btn-light disabled"
                            style={{ minWidth: "40px" }}
                          >
                            {qtd}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={() => adicionarLanche(lanche.id!)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {Object.keys(lanchesSelecionados).length > 0 && (
                  <div className="mt-2 text-end">
                    <Badge variant="warning" icon="cup-straw">
                      Subtotal Lanches: {formatCurrency(calcularTotalLanches())}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            <Alert
              type="success"
              autoClose={false}
              dismissible={false}
              message={
                <span className="d-block text-center">
                  <i className="bi bi-cash me-2"></i>
                  Valor Total:{" "}
                  <strong>{formatCurrency(calcularValorTotal())}</strong>
                  {Object.keys(lanchesSelecionados).length > 0 && (
                    <small className="d-block text-muted">
                      (Ingresso:{" "}
                      {formatCurrency(getValorPorTipo(vendaForm.tipo))} +
                      Lanches: {formatCurrency(calcularTotalLanches())})
                    </small>
                  )}
                </span>
              }
            />
          </>
        )}
      </Modal>
    </Container>
  );
};
