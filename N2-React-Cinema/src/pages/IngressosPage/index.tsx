import { useState, useEffect } from "react";
import {
  type IIngresso,
  VALOR_INTEIRA,
  VALOR_MEIA,
} from "../../models/ingresso.model";
import { type ISessao } from "../../models/sessao.model";
import { type IFilme } from "../../models/filme.model";
import { type ISala } from "../../models/sala.model";
import { type ILanche, type IPedidoLanche } from "../../models/lanche.model";
import {
  ingressoService,
  sessaoService,
  filmeService,
  salaService,
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
  Loading,
  EmptyState,
  Table,
  StatCard,
  Badge,
  Modal,
  FormInput,
} from "../../components";

export const IngressosPage = () => {
  const [ingressos, setIngressos] = useState<IIngresso[]>([]);
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [lanches, setLanches] = useState<ILanche[]>([]);
  const [pedidosLanches, setPedidosLanches] = useState<IPedidoLanche[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  // Estado para edição de preços base
  const [showEditModal, setShowEditModal] = useState(false);
  const [valorInteira, setValorInteira] = useState<number>(VALOR_INTEIRA);
  const [valorMeia, setValorMeia] = useState<number>(VALOR_MEIA);
  const [valorInteiraTemp, setValorInteiraTemp] =
    useState<number>(VALOR_INTEIRA);
  const [valorMeiaTemp, setValorMeiaTemp] = useState<number>(VALOR_MEIA);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [
        filmesData,
        salasData,
        sessoesData,
        ingressosData,
        lanchesData,
        pedidosData,
      ] = await Promise.all([
        filmeService.findAll(),
        salaService.findAll(),
        sessaoService.findAll(),
        ingressoService.findAll(),
        lancheService.findAll(),
        pedidoLancheService.findAll(),
      ]);
      setFilmes(filmesData);
      setSalas(salasData);
      setSessoes(sessoesData);
      setIngressos(ingressosData);
      setLanches(lanchesData);
      setPedidosLanches(pedidosData);
    } catch {
      setAlert({ message: "Erro ao carregar dados!", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  // Funções de edição de preços
  const abrirModalEdicao = () => {
    setValorInteiraTemp(valorInteira);
    setValorMeiaTemp(valorMeia);
    setShowEditModal(true);
  };

  const fecharModalEdicao = () => {
    setShowEditModal(false);
  };

  const handleSalvarPrecos = () => {
    if (valorInteiraTemp <= 0 || valorMeiaTemp <= 0) {
      setAlert({
        message: "Os valores devem ser maiores que zero!",
        type: "danger",
      });
      return;
    }

    setValorInteira(valorInteiraTemp);
    setValorMeia(valorMeiaTemp);
    fecharModalEdicao();
    setAlert({
      message: `Preços atualizados! Inteira: ${formatCurrency(
        valorInteiraTemp
      )} | Meia: ${formatCurrency(valorMeiaTemp)}`,
      type: "success",
    });
  };

  // Calcular totais
  const totalVendido = ingressos.reduce(
    (acc, ing) => acc + ing.valorUnitario,
    0
  );
  const totalInteiras = ingressos.filter((i) => i.tipo === "inteira").length;
  const totalMeias = ingressos.filter((i) => i.tipo === "meia").length;

  // Função para buscar lanches associados a um ingresso (pelo nome do cliente e data)
  const getLanchesDoIngresso = (ingresso: IIngresso) => {
    if (!ingresso.nomeCliente) return [];

    return pedidosLanches
      .filter(
        (p) =>
          p.nomeCliente === ingresso.nomeCliente &&
          p.dataPedido === ingresso.dataVenda
      )
      .map((pedido) => {
        const lanche = lanches.find((l) => l.id === pedido.lancheId);
        return {
          ...pedido,
          nomeLanche: lanche?.nome || "Lanche não encontrado",
        };
      });
  };

  const tableColumns = [
    {
      key: "id",
      header: "#",
      render: (ingresso: IIngresso) => (
        <Badge variant="secondary">{ingresso.id}</Badge>
      ),
    },
    {
      key: "filme",
      header: "Filme",
      render: (ingresso: IIngresso) => {
        const sessao = sessoes.find((s) => s.id === ingresso.sessaoId);
        const filme = sessao
          ? filmes.find((f) => f.id === sessao.filmeId)
          : null;
        return (
          <>
            <i className="bi bi-film me-2"></i>
            {filme?.titulo || "N/A"}
          </>
        );
      },
    },
    {
      key: "sessao",
      header: "Sessão",
      render: (ingresso: IIngresso) => {
        const sessao = sessoes.find((s) => s.id === ingresso.sessaoId);
        const sala = sessao ? salas.find((s) => s.id === sessao.salaId) : null;
        return sessao ? (
          <>
            Sala {sala?.numero || "?"} - {sessao.horario}
          </>
        ) : (
          "N/A"
        );
      },
    },
    {
      key: "cliente",
      header: "Cliente",
      render: (ingresso: IIngresso) => ingresso.nomeCliente || "-",
    },
    {
      key: "tipo",
      header: "Tipo",
      render: (ingresso: IIngresso) => (
        <Badge variant={ingresso.tipo === "inteira" ? "primary" : "warning"}>
          {ingresso.tipo}
        </Badge>
      ),
    },
    {
      key: "valor",
      header: "Valor",
      render: (ingresso: IIngresso) => (
        <span className="text-success fw-bold">
          {formatCurrency(ingresso.valorUnitario)}
        </span>
      ),
    },
    {
      key: "dataVenda",
      header: "Data Venda",
      render: (ingresso: IIngresso) => formatDate(ingresso.dataVenda),
    },
    {
      key: "lanches",
      header: "Lanches",
      render: (ingresso: IIngresso) => {
        const lanchesAssociados = getLanchesDoIngresso(ingresso);
        if (lanchesAssociados.length === 0)
          return <span className="text-muted">-</span>;

        return (
          <div className="small">
            {lanchesAssociados.map((p, idx) => (
              <div key={idx}>
                {p.quantidade}x {p.nomeLanche}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Container>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <PageHeader
        title="Ingressos Vendidos"
        icon="ticket-perforated"
        variant="info"
      />

      {/* Cards de Resumo */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <StatCard
            title="Total de Ingressos"
            value={ingressos.length}
            icon="ticket-perforated"
            variant="primary"
          />
        </div>
        <div className="col-md-4 mb-3">
          <StatCard
            title="Total Arrecadado"
            value={formatCurrency(totalVendido)}
            icon="cash-stack"
            variant="success"
          />
        </div>
        <div className="col-md-4 mb-3">
          <StatCard
            title="Inteiras / Meias"
            value={`${totalInteiras} / ${totalMeias}`}
            icon="pie-chart"
            variant="info"
          />
        </div>
      </div>

      {/* Tabela de Preços*/}
      <div className="row mb-4">
        <div className="col-md-6">
          <Card>
            <CardHeader
              variant="secondary"
              icon="tag"
              actions={
                <Button
                  variant="light"
                  size="sm"
                  icon="pencil"
                  onClick={abrirModalEdicao}
                >
                  Editar Preços
                </Button>
              }
            >
              Tabela de Preços
            </CardHeader>
            <CardBody>
              <div className="row text-center">
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <i className="bi bi-ticket-detailed display-5 text-primary"></i>
                    <h5 className="mt-2">Inteira</h5>
                    <h3 className="text-success">
                      {formatCurrency(valorInteira)}
                    </h3>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <i className="bi bi-ticket display-5 text-warning"></i>
                    <h5 className="mt-2">Meia</h5>
                    <h3 className="text-success">
                      {formatCurrency(valorMeia)}
                    </h3>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Lista de Ingressos Vendidos */}
      <div className="row">
        <div className="col-12">
          <Card>
            <CardHeader variant="info" icon="list-ul" badge={ingressos.length}>
              Histórico de Vendas
            </CardHeader>
            <CardBody scrollable maxHeight="500px">
              {loading ? (
                <Loading variant="info" />
              ) : ingressos.length === 0 ? (
                <EmptyState
                  icon="ticket-perforated"
                  title="Nenhum ingresso vendido"
                  description="Nenhum ingresso foi vendido até o momento."
                />
              ) : (
                <Table
                  columns={tableColumns}
                  data={ingressos}
                  keyExtractor={(ingresso) => ingresso.id || 0}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal de Edição de Preços */}
      <Modal
        show={showEditModal}
        onClose={fecharModalEdicao}
        title="Editar Preços dos Ingressos"
        icon="tag"
        footer={
          <>
            <Button variant="secondary" icon="x-lg" onClick={fecharModalEdicao}>
              Cancelar
            </Button>
            <Button
              variant="warning"
              icon="check-lg"
              onClick={handleSalvarPrecos}
            >
              Salvar Preços
            </Button>
          </>
        }
      >
        <Alert
          type="info"
          autoClose={false}
          dismissible={false}
          icon="info-circle"
          message="Altere os valores dos ingressos. A meia-entrada é automaticamente calculada como 50% da inteira."
        />

        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="p-3 border rounded text-center">
              <i className="bi bi-ticket-detailed display-6 text-primary mb-2"></i>
              <h6>Inteira</h6>
              <FormInput
                label=""
                type="number"
                step="0.01"
                min={0.01}
                value={valorInteiraTemp}
                onChange={(e) => {
                  const valor = parseFloat(e.target.value) || 0;
                  setValorInteiraTemp(valor);
                  setValorMeiaTemp(valor / 2);
                }}
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="p-3 border rounded text-center">
              <i className="bi bi-ticket display-6 text-warning mb-2"></i>
              <h6>Meia (50%)</h6>
              <FormInput
                label=""
                type="number"
                step="0.01"
                min={0.01}
                value={valorMeiaTemp}
                onChange={(e) =>
                  setValorMeiaTemp(parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-light rounded">
          <div className="row text-center">
            <div className="col-6">
              <small className="text-muted">Inteira:</small>
              <h5 className="text-success mb-0">
                {formatCurrency(valorInteiraTemp)}
              </h5>
            </div>
            <div className="col-6">
              <small className="text-muted">Meia:</small>
              <h5 className="text-success mb-0">
                {formatCurrency(valorMeiaTemp)}
              </h5>
            </div>
          </div>
        </div>
      </Modal>
    </Container>
  );
};
