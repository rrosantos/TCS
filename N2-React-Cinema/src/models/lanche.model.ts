import { z } from "zod";

// Categorias de lanches
export enum CategoriaLanche {
  PIPOCA = "Pipoca",
  BEBIDA = "Bebida",
  DOCE = "Doce",
  SALGADO = "Salgado",
  COMBO = "Combo",
}

export const CATEGORIAS = Object.values(CategoriaLanche);

// Tamanhos disponíveis
export enum TamanhoLanche {
  PEQUENO = "Pequeno",
  MEDIO = "Médio",
  GRANDE = "Grande",
}

export const TAMANHOS = Object.values(TamanhoLanche);

// Interface do Lanche
export interface ILanche {
  id?: number;
  nome: string;
  descricao: string;
  categoria: CategoriaLanche;
  preco: number;
  tamanho?: TamanhoLanche;
  disponivel: boolean;
  imagem?: string;
}

// Schema de validação com Zod
export const lancheSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  descricao: z
    .string()
    .min(5, "Descrição deve ter pelo menos 5 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  categoria: z.nativeEnum(CategoriaLanche, {
    errorMap: () => ({ message: "Selecione uma categoria" }),
  }),
  preco: z
    .number()
    .min(0.01, "Preço deve ser maior que zero")
    .max(500, "Preço deve ser no máximo R$ 500,00"),
  tamanho: z.nativeEnum(TamanhoLanche).optional(),
  disponivel: z.boolean(),
  imagem: z.string().optional(),
});

// Interface para pedido de lanche
export interface IPedidoLanche {
  id?: number;
  lancheId: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  dataPedido: string;
  nomeCliente?: string;
  observacao?: string;
}

// Schema de validação do pedido
export const pedidoLancheSchema = z.object({
  lancheId: z.number().min(1, "Selecione um lanche"),
  quantidade: z
    .number()
    .min(1, "Quantidade mínima é 1")
    .max(20, "Quantidade máxima é 20"),
  nomeCliente: z.string().optional(),
  observacao: z
    .string()
    .max(200, "Observação deve ter no máximo 200 caracteres")
    .optional(),
});
