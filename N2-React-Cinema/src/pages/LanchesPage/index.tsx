import { useState, useEffect } from "react";
import {
  type ILanche,
  type IPedidoLanche,
  CategoriaLanche,
  TamanhoLanche,
  CATEGORIAS,
  TAMANHOS,
  lancheSchema,
} from "../../models/lanche.model";
import { lancheService, pedidoLancheService } from "../../services/api.service";
import { formatCurrency } from "../../utils/formatters";
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  PageHeader,
  FormInput,
  FormSelect,
  FormTextarea,
  Loading,
  EmptyState,
  Badge,
  ConfirmDialog,
  StatCard,
} from "../../components";

export const LanchesPage = () => {
  const [lanches, setLanches] = useState<ILanche[]>([]);
  const [pedidos, setPedidos] = useState<IPedidoLanche[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Omit<ILanche, "id">>({
    nome: "",
    descricao: "",
    categoria: CategoriaLanche.PIPOCA,
    preco: 0,
    tamanho: undefined,
    disponivel: true,
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    id: number | null;
  }>({ show: false, id: null });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [lanchesData, pedidosData] = await Promise.all([
        lancheService.findAll(),
        pedidoLancheService.findAll(),
      ]);
      setLanches(lanchesData);
      setPedidos(pedidosData);
    } catch {
      setAlert({ message: "Erro ao carregar dados!", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = lancheSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setAlert({ message: "Corrija os erros do formulário!", type: "danger" });
      return;
    }

    const existente = lanches.find(
      (l) => l.nome.toLowerCase() === form.nome.toLowerCase()
    );
    if (existente) {
      setErrors({ nome: "Já existe um lanche com este nome!" });
      setAlert({
        message: "Já existe um lanche com este nome!",
        type: "danger",
      });
      return;
    }

    try {
      await lancheService.create(form);
      await carregarDados();
      limparFormulario();
      setAlert({
        message: `Lanche "${form.nome}" cadastrado com sucesso!`,
        type: "success",
      });
    } catch {
      setAlert({ message: "Erro ao salvar lanche!", type: "danger" });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await lancheService.delete(confirmDelete.id);
      await carregarDados();
      setAlert({ message: "Lanche excluído com sucesso!", type: "success" });
    } catch {
      setAlert({ message: "Erro ao excluir lanche!", type: "danger" });
    } finally {
      setConfirmDelete({ show: false, id: null });
    }
  };

  const limparFormulario = () => {
    setErrors({});
    setForm({
      nome: "",
      descricao: "",
      categoria: CategoriaLanche.PIPOCA,
      preco: 0,
      tamanho: undefined,
      disponivel: true,
    });
  };

  // Calcular totais
  const totalVendido = pedidos.reduce((acc, p) => acc + p.valorTotal, 0);
  const totalPedidos = pedidos.reduce((acc, p) => acc + p.quantidade, 0);

  const categoriaOptions = CATEGORIAS.map((c) => ({ value: c, label: c }));
  const tamanhoOptions = TAMANHOS.map((t) => ({ value: t, label: t }));

  const getCategoriaIcon = (categoria: CategoriaLanche) => {
    const icons: Record<CategoriaLanche, string> = {
      [CategoriaLanche.PIPOCA]: "box-seam",
      [CategoriaLanche.BEBIDA]: "cup-straw",
      [CategoriaLanche.DOCE]: "cake2",
      [CategoriaLanche.SALGADO]: "egg-fried",
      [CategoriaLanche.COMBO]: "basket3",
    };
    return icons[categoria] || "box";
  };

  const getCategoriaBadgeVariant = (categoria: CategoriaLanche) => {
    const variants: Record<
      CategoriaLanche,
      "primary" | "success" | "warning" | "info" | "danger"
    > = {
      [CategoriaLanche.PIPOCA]: "warning",
      [CategoriaLanche.BEBIDA]: "info",
      [CategoriaLanche.DOCE]: "danger",
      [CategoriaLanche.SALGADO]: "success",
      [CategoriaLanche.COMBO]: "primary",
    };
    return variants[categoria] || "secondary";
  };

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
        title="Bomboniere - Lanches"
        icon="cup-straw"
        variant="warning"
      />

      {/* Cards de Resumo */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <StatCard
            title="Lanches Disponíveis"
            value={lanches.filter((l) => l.disponivel).length}
            icon="box-seam"
            variant="warning"
          />
        </div>
        <div className="col-md-4 mb-3">
          <StatCard
            title="Total de Pedidos"
            value={totalPedidos}
            icon="bag-check"
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
      </div>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <Card>
            <CardHeader icon="plus-circle" variant="warning">
              Cadastrar Novo Lanche
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Nome do Lanche"
                  type="text"
                  maxLength={50}
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  error={errors.nome}
                  required
                />

                <FormTextarea
                  label="Descrição"
                  rows={2}
                  maxLength={200}
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  error={errors.descricao}
                  showCharCount
                  required
                />

                <div className="row">
                  <div className="col-md-6">
                    <FormSelect
                      label="Categoria"
                      options={categoriaOptions}
                      value={form.categoria}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          categoria: e.target.value as CategoriaLanche,
                        })
                      }
                      error={errors.categoria}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormSelect
                      label="Tamanho"
                      options={tamanhoOptions}
                      value={form.tamanho || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          tamanho:
                            (e.target.value as TamanhoLanche) || undefined,
                        })
                      }
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <FormInput
                  label="Preço (R$)"
                  type="number"
                  step="0.01"
                  min={0.01}
                  max={500}
                  value={form.preco || ""}
                  onChange={(e) =>
                    setForm({ ...form, preco: parseFloat(e.target.value) || 0 })
                  }
                  error={errors.preco}
                  required
                />

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="disponivel"
                    checked={form.disponivel}
                    onChange={(e) =>
                      setForm({ ...form, disponivel: e.target.checked })
                    }
                  />
                  <label className="form-check-label" htmlFor="disponivel">
                    <i className="bi bi-check-circle me-1"></i>
                    Disponível para venda
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <Button type="submit" variant="warning" icon="check-lg">
                    Salvar Lanche
                  </Button>
                  <Button
                    type="button"
                    variant="cinema"
                    icon="arrow-clockwise"
                    onClick={limparFormulario}
                  >
                    Limpar
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-7 mb-4">
          <Card>
            <CardHeader icon="list-ul" badge={lanches.length} variant="warning">
              Cardápio
            </CardHeader>
            <CardBody scrollable maxHeight="600px">
              {loading ? (
                <Loading variant="warning" />
              ) : lanches.length === 0 ? (
                <EmptyState
                  icon="cup-straw"
                  title="Nenhum lanche cadastrado"
                  description="Adicione lanches usando o formulário ao lado."
                />
              ) : (
                <div className="row">
                  {lanches.map((lanche) => (
                    <div key={lanche.id} className="col-md-6 mb-3">
                      <Card
                        shadow
                        className={!lanche.disponivel ? "opacity-50" : ""}
                      >
                        <CardBody>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="card-title mb-1">
                                <i
                                  className={`bi bi-${getCategoriaIcon(
                                    lanche.categoria
                                  )} me-2`}
                                ></i>
                                {lanche.nome}
                              </h6>
                              <Badge
                                variant={getCategoriaBadgeVariant(
                                  lanche.categoria
                                )}
                                className="me-1"
                              >
                                {lanche.categoria}
                              </Badge>
                              {lanche.tamanho && (
                                <Badge variant="secondary">
                                  {lanche.tamanho}
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              icon="trash"
                              onClick={() =>
                                lanche.id &&
                                setConfirmDelete({ show: true, id: lanche.id })
                              }
                            >
                              {""}
                            </Button>
                          </div>
                          <p className="card-text small text-muted mb-2">
                            {lanche.descricao}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="h5 text-success mb-0">
                              {formatCurrency(lanche.preco)}
                            </span>
                          </div>
                          {!lanche.disponivel && (
                            <Badge variant="danger" className="mt-2">
                              Indisponível
                            </Badge>
                          )}
                        </CardBody>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        show={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Excluir Lanche"
        message="Deseja realmente excluir este lanche? Esta ação não pode ser desfeita."
      />
    </Container>
  );
};
