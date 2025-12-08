import { useState, useEffect } from "react";
import {
  type IFilme,
  GeneroFilme,
  GENEROS,
  CLASSIFICACOES,
  filmeSchema,
} from "../../models/filme.model";
import { filmeService } from "../../services/api.service";
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
  FormTextarea,
  Loading,
  EmptyState,
  Badge,
  ConfirmDialog,
} from "../../components";

export const FilmesPage = () => {
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Omit<IFilme, "id">>({
    titulo: "",
    sinopse: "",
    classificacao: "",
    duracao: 0,
    genero: GeneroFilme.ACAO,
    dataInicialExibicao: "",
    dataFinalExibicao: "",
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
    carregarFilmes();
  }, []);

  const carregarFilmes = async () => {
    setLoading(true);
    try {
      const data = await filmeService.findAll();
      setFilmes(data);
    } catch {
      setAlert({ message: "Erro ao carregar filmes!", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = filmeSchema.safeParse(form);
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

    if (new Date(form.dataFinalExibicao) < new Date(form.dataInicialExibicao)) {
      setErrors({
        dataFinalExibicao: "A data final deve ser maior que a data inicial!",
      });
      setAlert({
        message: "A data final deve ser maior que a data inicial!",
        type: "danger",
      });
      return;
    }

    // Verificar título duplicado (exceto para o filme sendo editado)
    const existente = filmes.find(
      (f) =>
        f.titulo.toLowerCase() === form.titulo.toLowerCase() &&
        f.id !== editingId
    );
    if (existente) {
      setErrors({ titulo: "Já existe um filme cadastrado com este título!" });
      setAlert({
        message: "Já existe um filme cadastrado com este título!",
        type: "danger",
      });
      return;
    }

    try {
      if (editingId) {
        // Modo edição
        await filmeService.update(editingId, form);
        setAlert({
          message: `Filme "${form.titulo}" atualizado com sucesso!`,
          type: "success",
        });
      } else {
        // Modo criação
        await filmeService.create(form);
        setAlert({
          message: `Filme "${form.titulo}" salvo com sucesso!`,
          type: "success",
        });
      }
      await carregarFilmes();
      limparFormulario();
    } catch {
      setAlert({
        message: editingId
          ? "Erro ao atualizar filme!"
          : "Erro ao salvar filme!",
        type: "danger",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await filmeService.delete(confirmDelete.id);
      await carregarFilmes();
      setAlert({ message: "Filme excluído com sucesso!", type: "success" });
    } catch {
      setAlert({ message: "Erro ao excluir filme!", type: "danger" });
    } finally {
      setConfirmDelete({ show: false, id: null });
    }
  };

  const limparFormulario = () => {
    setErrors({});
    setEditingId(null);
    setForm({
      titulo: "",
      sinopse: "",
      classificacao: "",
      duracao: 0,
      genero: GeneroFilme.ACAO,
      dataInicialExibicao: "",
      dataFinalExibicao: "",
    });
  };

  const handleEdit = (filme: IFilme) => {
    setEditingId(filme.id || null);
    setForm({
      titulo: filme.titulo,
      sinopse: filme.sinopse,
      classificacao: filme.classificacao,
      duracao: filme.duracao,
      genero: filme.genero,
      dataInicialExibicao: filme.dataInicialExibicao,
      dataFinalExibicao: filme.dataFinalExibicao,
    });
    setErrors({});
    // Scroll para o formulário
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatarDuracao = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const generoOptions = GENEROS.map((g) => ({ value: g, label: g }));
  const classificacaoOptions = CLASSIFICACOES.map((c) => ({
    value: c,
    label: c,
  }));

  return (
    <Container>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <PageHeader title="Gerenciamento de Filmes" icon="film" />

      <div className="row">
        <div className="col-lg-5 mb-4">
          <Card>
            <CardHeader
              icon={editingId ? "pencil-square" : "plus-circle"}
              variant={editingId ? "warning" : "primary"}
            >
              {editingId ? "Editar Filme" : "Cadastrar Novo Filme"}
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Título"
                  type="text"
                  maxLength={100}
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  error={errors.titulo}
                  required
                />

                <FormTextarea
                  label="Sinopse (mínimo 10 caracteres)"
                  rows={3}
                  maxLength={1000}
                  value={form.sinopse}
                  onChange={(e) =>
                    setForm({ ...form, sinopse: e.target.value })
                  }
                  error={errors.sinopse}
                  showCharCount
                  required
                />

                <div className="row">
                  <div className="col-md-6">
                    <FormSelect
                      label="Gênero"
                      options={generoOptions}
                      value={form.genero}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          genero: e.target.value as GeneroFilme,
                        })
                      }
                      error={errors.genero}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormSelect
                      label="Classificação"
                      options={classificacaoOptions}
                      value={form.classificacao}
                      onChange={(e) =>
                        setForm({ ...form, classificacao: e.target.value })
                      }
                      error={errors.classificacao}
                      required
                    />
                  </div>
                </div>

                <FormInput
                  label="Duração (minutos)"
                  type="number"
                  min={1}
                  max={600}
                  value={form.duracao || ""}
                  onChange={(e) =>
                    setForm({ ...form, duracao: parseInt(e.target.value) || 0 })
                  }
                  error={errors.duracao}
                  required
                />

                <div className="row">
                  <div className="col-md-6">
                    <FormInput
                      label="Data Inicial Exibição"
                      type="date"
                      value={form.dataInicialExibicao}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          dataInicialExibicao: e.target.value,
                        })
                      }
                      error={errors.dataInicialExibicao}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="Data Final Exibição"
                      type="date"
                      value={form.dataFinalExibicao}
                      onChange={(e) =>
                        setForm({ ...form, dataFinalExibicao: e.target.value })
                      }
                      error={errors.dataFinalExibicao}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant={editingId ? "warning" : "primary"}
                    icon={editingId ? "check-lg" : "plus-lg"}
                  >
                    {editingId ? "Atualizar Filme" : "Salvar Filme"}
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
            <CardHeader icon="list-ul" badge={filmes.length}>
              Filmes Cadastrados
            </CardHeader>
            <CardBody scrollable maxHeight="600px">
              {loading ? (
                <Loading />
              ) : filmes.length === 0 ? (
                <EmptyState
                  icon="film"
                  title="Nenhum filme cadastrado"
                  description="Adicione um novo filme usando o formulário ao lado."
                />
              ) : (
                <div className="row">
                  {filmes.map((filme) => (
                    <div key={filme.id} className="col-md-6 mb-3">
                      <Card shadow>
                        <CardBody>
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="card-title mb-1">{filme.titulo}</h6>
                            <div className="btn-group btn-group-sm">
                              <Button
                                variant="outline-warning"
                                size="sm"
                                icon="pencil"
                                onClick={() => handleEdit(filme)}
                              >
                                {""}
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                icon="trash"
                                onClick={() =>
                                  filme.id &&
                                  setConfirmDelete({ show: true, id: filme.id })
                                }
                              >
                                {""}
                              </Button>
                            </div>
                          </div>
                          <p
                            className="card-text small text-muted mb-2"
                            style={{
                              maxHeight: "60px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {filme.sinopse}
                          </p>
                          <div className="small">
                            <Badge variant="secondary" className="me-1">
                              {filme.genero}
                            </Badge>
                            <Badge variant="info" className="me-1">
                              {filme.classificacao}
                            </Badge>
                            <Badge variant="dark">
                              {formatarDuracao(filme.duracao)}
                            </Badge>
                          </div>
                          <p className="mb-0 mt-2 small text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {formatDate(filme.dataInicialExibicao)} -{" "}
                            {formatDate(filme.dataFinalExibicao)}
                          </p>
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
        title="Excluir Filme"
        message="Deseja realmente excluir este filme? Esta ação não pode ser desfeita."
      />
    </Container>
  );
};
