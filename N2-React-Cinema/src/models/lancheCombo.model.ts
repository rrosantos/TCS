import { z } from 'zod';

export interface ILancheCombo {
    id: number;
    nome: string;
    descricao: string;
    valorUnitario: number;
    qtUnidade: number;
    subtotal: number;
}

export const lancheComboSchema = z.object({
    id: z.number().optional(),
    nome: z.string()
        .min(1, 'O nome é obrigatório')
        .max(100, 'O nome deve ter no máximo 100 caracteres'),
    descricao: z.string()
        .min(1, 'A descrição é obrigatória')
        .max(500, 'A descrição deve ter no máximo 500 caracteres'),
    valorUnitario: z.number()
        .min(0.01, 'O valor unitário deve ser maior que zero'),
    qtUnidade: z.number()
        .min(1, 'A quantidade mínima é 1'),
    subtotal: z.number().optional()
});

// Função para calcular subtotal
export function calcularSubtotal(valorUnitario: number, qtUnidade: number): number {
    return valorUnitario * qtUnidade;
}
