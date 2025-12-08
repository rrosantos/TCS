import { useState, useEffect } from "react";
import { type ISala, salaSchema } from "../../models/sala.model";
import { salaService } from "../../services/api.service";
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
  Table,
  ConfirmDialog,
} from "../../components";

export const SalasPage = () => {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    numero: 0,
    capacidade: 0,
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
    carregarSalas();
  }, []);

  const carregarSalas = async () => {
    setLoading(true);
    try {
      const data = await salaService.findAll();
      setSalas(data);
    } catch {
      setAlert({ message: "Erro ao carregar salas!", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = salaSchema.safeParse(form);
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

    // Verificar número duplicado (exceto para a sala sendo editada)
    const existente = salas.find(
      (s) => s.numero === form.numero && s.id !== editingId
    );
    if (existente) {
      setErrors({ numero: "Já existe uma sala com este número!" });
      setAlert({
        message: "Já existe uma sala com este número!",
        type: "danger",
      });
      return;
    }

    const dadosSala: Omit<ISala, "id"> = {
      numero: form.numero,
      capacidade: form.capacidade,
    };

    try {
      if (editingId) {
        // Modo edição
        await salaService.update(editingId, dadosSala);
        setAlert({
          message: `Sala ${form.numero} atualizada com sucesso!`,
          type: "success",
        });
      } else {
        // Modo criação
        await salaService.create(dadosSala);
        setAlert({
          message: `Sala ${form.numero} criada com ${form.capacidade} lugares!`,
          type: "success",
        });
      }
      await carregarSalas();
      limparFormulario();
    } catch {
      setAlert({
        message: editingId ? "Erro ao atualizar sala!" : "Erro ao criar sala!",
        type: "danger",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await salaService.delete(confirmDelete.id);
      await carregarSalas();
      setAlert({ message: "Sala excluída com sucesso!", type: "success" });
    } catch {
      setAlert({ message: "Erro ao excluir sala!", type: "danger" });
    } finally {
      setConfirmDelete({ show: false, id: null });
    }
  };

  const limparFormulario = () => {
    setErrors({});
    setEditingId(null);
    setForm({ numero: 0, capacidade: 0 });
  };

  const handleEdit = (sala: ISala) => {
    setEditingId(sala.id || null);
    setForm({
      numero: sala.numero,
      capacidade: sala.capacidade,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tableColumns = [
    {
      key: "numero",
      header: "Número",
      render: (sala: ISala) => (
        <>
          <i className="bi bi-door-open me-2"></i>
          Sala {sala.numero}
        </>
      ),
    },
    {
      key: "capacidade",
      header: "Capacidade",
      render: (sala: ISala) => (
        <>
          <i className="bi bi-people me-2"></i>
          {sala.capacidade} lugares
        </>
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      className: "text-end",
      render: (sala: ISala) => (
        <div className="btn-group btn-group-sm">
          <Button
            variant="outline-warning"
            size="sm"
            icon="pencil"
            onClick={() => handleEdit(sala)}
          >
            {""}
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            icon="trash"
            onClick={() =>
              sala.id && setConfirmDelete({ show: true, id: sala.id })
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

      <PageHeader title="Gerenciamento de Salas" icon="building" />

      <div className="row">
        <div className="col-lg-5 mb-4">
          <Card>
            <CardHeader
              icon={editingId ? "pencil-square" : "plus-circle"}
              variant={editingId ? "warning" : "primary"}
            >
              {editingId ? "Editar Sala" : "Cadastrar Nova Sala"}
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Número da Sala"
                  type="number"
                  min={1}
                  value={form.numero || ""}
                  onChange={(e) =>
                    setForm({ ...form, numero: parseInt(e.target.value) || 0 })
                  }
                  error={errors.numero}
                  required
                />

                <FormInput
                  label="Capacidade Máxima"
                  type="number"
                  min={1}
                  max={1000}
                  value={form.capacidade || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      capacidade: parseInt(e.target.value) || 0,
                    })
                  }
                  error={errors.capacidade}
                  helpText="Número máximo de pessoas na sala."
                  required
                />

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant={editingId ? "warning" : "primary"}
                    icon={editingId ? "check-lg" : "plus-lg"}
                  >
                    {editingId ? "Atualizar Sala" : "Salvar Sala"}
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
            <CardHeader icon="list-ul" badge={salas.length}>
              Salas Cadastradas
            </CardHeader>
            <CardBody>
              {loading ? (
                <Loading />
              ) : salas.length === 0 ? (
                <EmptyState
                  icon="building"
                  title="Nenhuma sala cadastrada"
                  description="Adicione uma nova sala usando o formulário ao lado."
                />
              ) : (
                <Table
                  columns={tableColumns}
                  data={salas}
                  keyExtractor={(sala) => sala.id || 0}
                  emptyMessage="Nenhuma sala cadastrada."
                  emptyIcon="building"
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
        title="Excluir Sala"
        message="Deseja realmente excluir esta sala? Esta ação não pode ser desfeita."
      />
    </Container>
  );
};
