const API_URL = "http://localhost:3000";

// Serviço genérico para API REST
export class ApiService<T extends { id?: number }> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `${API_URL}/${endpoint}`;
  }

  async findAll(): Promise<T[]> {
    const response = await fetch(this.endpoint);
    if (!response.ok) throw new Error("Erro ao buscar dados");
    return response.json();
  }

  async findById(id: number): Promise<T | null> {
    const response = await fetch(`${this.endpoint}/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async create(item: Omit<T, "id">): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Erro ao criar");
    return response.json();
  }

  async update(id: number, item: Partial<T>): Promise<T> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, id }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar");
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir");
  }
}

// Instâncias dos serviços
import type { IFilme } from "../models/filme.model";
import type { ISala } from "../models/sala.model";
import type { ISessao } from "../models/sessao.model";
import type { IIngresso } from "../models/ingresso.model";
import type { ILanche, IPedidoLanche } from "../models/lanche.model";

export const filmeService = new ApiService<IFilme>("filmes");
export const salaService = new ApiService<ISala>("salas");
export const sessaoService = new ApiService<ISessao>("sessoes");
export const ingressoService = new ApiService<IIngresso>("ingressos");
export const lancheService = new ApiService<ILanche>("lanches");
export const pedidoLancheService = new ApiService<IPedidoLanche>(
  "pedidosLanches"
);
