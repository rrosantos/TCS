import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type ISessao, sessaoSchema } from "../../models/sessao.model";
import { type IFilme } from "../../models/filme.model";
import { type ISala } from "../../models/sala.model";
import { type IIngresso } from "../../models/ingresso.model";
import {
  sessaoService,
  filmeService,
  salaService,
  ingressoService,
} from "../../services/api.service";
import { formatDate } from "../../utils/formatters";
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
  Loading,
  EmptyState,
  Table,
  Badge,
  ConfirmDialog,
} from "../../components";

export const SessoesPage = () => {
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [ingressosVendidos, setIngressosVendidos] = useState<IIngresso[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    filmeId: 0,
    salaId: 0,
    data: "",
    horario: "",
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
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [filmesData, salasData, sessoesData, ingressosData] =
        await Promise.all([
          filmeService.findAll(),
          salaService.findAll(),
          sessaoService.findAll(),
          ingressoService.findAll(),
        ]);
      setFilmes(filmesData);
      setSalas(salasData);
      setSessoes(sessoesData);
      setIngressosVendidos(ingressosData);
    } catch {
      setAlert({ message: "Erro ao carregar dados!", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = sessaoSchema.safeParse(form);
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

    const dadosSessao: Omit<ISessao, "id"> = {
      filmeId: form.filmeId,
      salaId: form.salaId,
      data: form.data,
      horario: form.horario,
    };

    try {
      const filme = filmes.find((f) => f.id === form.filmeId);
      const sala = salas.find((s) => s.id === form.salaId);

      if (editingId) {
        // Modo edição
        await sessaoService.update(editingId, dadosSessao);
        setAlert({
          message: `Sessão de "${filme?.titulo}" na Sala ${sala?.numero} atualizada!`,
          type: "success",
        });
      } else {
        // Modo criação
        await sessaoService.create(dadosSessao);
        setAlert({
          message: `Sessão de "${filme?.titulo}" na Sala ${sala?.numero} criada!`,
          type: "success",
        });
      }
      await carregarDados();
      limparFormulario();
    } catch {
      setAlert({
        message: editingId
          ? "Erro ao atualizar sessão!"
          : "Erro ao criar sessão!",
        type: "danger",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await sessaoService.delete(confirmDelete.id);
      await carregarDados();
      setAlert({ message: "Sessão excluída!", type: "success" });
    } catch {
      setAlert({ message: "Erro ao excluir sessão!", type: "danger" });
    } finally {
      setConfirmDelete({ show: false, id: null });
    }
  };

  const limparFormulario = () => {
    setErrors({});
    setEditingId(null);
    setForm({ filmeId: 0, salaId: 0, data: "", horario: "" });
  };

  const handleEdit = (sessao: ISessao) => {
    setEditingId(sessao.id || null);
    setForm({
      filmeId: sessao.filmeId,
      salaId: sessao.salaId,
      data: sessao.data,
      horario: sessao.horario,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDataMinima = () => new Date().toISOString().slice(0, 10);

  // Contar ingressos vendidos por sessão
  const contarIngressosSessao = (sessaoId: number) => {
    return ingressosVendidos.filter((i) => i.sessaoId === sessaoId).length;
  };

  const filmeOptions = filmes.map((f) => ({
    value: f.id!,
    label: `${f.titulo} (${f.duracao} min)`,
  }));
  const salaOptions = salas.map((s) => ({
    value: s.id!,
    label: `Sala ${s.numero} (${s.capacidade} lugares)`,
  }));

  const tableColumns = [
    {
      key: "filme",
      header: "Filme",
      render: (sessao: ISessao) => {
        const filme = filmes.find((f) => f.id === sessao.filmeId);
        return (
          <>
            <i className="bi bi-film me-2"></i>
            {filme?.titulo || "Filme não encontrado"}
          </>
        );
      },
    },
    {
      key: "sala",
      header: "Sala",
      render: (sessao: ISessao) => {
        const sala = salas.find((s) => s.id === sessao.salaId);
        return (
          <>
            <i className="bi bi-building me-2"></i>
            Sala {sala?.numero || "?"}
          </>
        );
      },
    },
    {
      key: "dataHora",
      header: "Data/Hora",
      render: (sessao: ISessao) => (
        <>
          <i className="bi bi-calendar me-2"></i>
          {formatDate(sessao.data)} {sessao.horario}
        </>
      ),
    },
    {
      key: "vendidos",
      header: "Vendidos",
      render: (sessao: ISessao) => {
        const sala = salas.find((s) => s.id === sessao.salaId);
        const qtdVendidos = contarIngressosSessao(sessao.id!);
        return (
          <Badge
            variant={qtdVendidos > 0 ? "success" : "secondary"}
            icon="ticket-perforated"
          >
            {qtdVendidos}/{sala?.capacidade || 0}
          </Badge>
        );
      },
    },
    {
      key: "acoes",
      header: "Ações",
      className: "text-end",
      render: (sessao: ISessao) => (
        <div className="btn-group btn-group-sm">
          <Button
            variant="outline-warning"
            size="sm"
            icon="pencil"
            onClick={() => handleEdit(sessao)}
          >
            {""}
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            icon="trash"
            onClick={() =>
              sessao.id && setConfirmDelete({ show: true, id: sessao.id })
            }
          >
            {""}
          </Button>
        </div>
      ),
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

      <PageHeader title="Gerenciamento de Sessões" icon="clock" />

      <div className="row">
        <div className="col-lg-5 mb-4">
          <Card>
            <CardHeader
              icon={editingId ? "pencil-square" : "plus-circle"}
              variant={editingId ? "warning" : "primary"}
            >
              {editingId ? "Editar Sessão" : "Nova Sessão"}
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormSelect
                  label="Filme"
                  options={filmeOptions}
                  value={form.filmeId}
                  onChange={(e) =>
                    setForm({ ...form, filmeId: parseInt(e.target.value) })
                  }
                  error={errors.filmeId}
                  placeholder="Selecione um filme"
                  helpText={
                    filmes.length === 0 ? (
                      <Link to="/filmes">Cadastrar filme primeiro</Link>
                    ) : undefined
                  }
                  required
                />

                <FormSelect
                  label="Sala"
                  options={salaOptions}
                  value={form.salaId}
                  onChange={(e) =>
                    setForm({ ...form, salaId: parseInt(e.target.value) })
                  }
                  error={errors.salaId}
                  placeholder="Selecione uma sala"
                  helpText={
                    salas.length === 0 ? (
                      <Link to="/salas">Cadastrar sala primeiro</Link>
                    ) : undefined
                  }
                  required
                />

                <FormInput
                  label="Data da Sessão"
                  type="date"
                  min={getDataMinima()}
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  error={errors.data}
                  helpText="A data não pode ser anterior à data atual."
                  required
                />

                <FormInput
                  label="Horário da Sessão"
                  type="time"
                  value={form.horario}
                  onChange={(e) =>
                    setForm({ ...form, horario: e.target.value })
                  }
                  error={errors.horario}
                  required
                />

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant={editingId ? "warning" : "primary"}
                    icon={editingId ? "check-lg" : "plus-lg"}
                    disabled={filmes.length === 0 || salas.length === 0}
                  >
                    {editingId ? "Atualizar Sessão" : "Salvar Sessão"}
                  </Button>
                  <Button
                    type="button"
                    variant={editingId ? "outline-secondary" : "cinema"}
                    icon={editingId ? "x-lg" : "arrow-clockwise"}
                    onClick={limparFormulario}
                  >
                    {editingId ? "Cancelar Edição" : "Limpar"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-7 mb-4">
          <Card>
            <CardHeader icon="list-ul" badge={sessoes.length}>
              Sessões Programadas
            </CardHeader>
            <CardBody scrollable maxHeight="600px">
              {loading ? (
                <Loading />
              ) : sessoes.length === 0 ? (
                <EmptyState
                  icon="clock"
                  title="Nenhuma sessão programada"
                  description="Adicione uma nova sessão usando o formulário ao lado."
                />
              ) : (
                <Table
                  columns={tableColumns}
                  data={sessoes}
                  keyExtractor={(sessao) => sessao.id || 0}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        show={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Excluir Sessão"
        message="Deseja realmente excluir esta sessão? Esta ação não pode ser desfeita."
      />
    </Container>
  );
};
