import { z } from 'zod';
import type { ISessao } from './sessao.model';

export type TipoIngresso = 'inteira' | 'meia';

export interface IIngresso {
    id?: number;
    sessaoId: number;
    sessao?: ISessao;
    tipo: TipoIngresso;
    valorUnitario: number;
    dataVenda: string;
    nomeCliente?: string;
}

export const ingressoSchema = z.object({
    id: z.number().optional(),
    sessaoId: z.number()
        .min(1, 'A sessão é obrigatória'),
    tipo: z.enum(['inteira', 'meia'], {
        required_error: 'Selecione o tipo de ingresso'
    }),
    valorUnitario: z.number()
        .min(0.01, 'O valor deve ser maior que zero'),
    dataVenda: z.string()
        .min(1, 'A data de venda é obrigatória'),
    nomeCliente: z.string().optional()
});

// Valores base dos ingressos (podem ser configurados)
export const VALOR_INTEIRA = 40.00;
export const VALOR_MEIA = 20.00;

// Função para calcular valor da meia automaticamente (50%)
export function calcularMeia(valorInteira: number): number {
    return valorInteira / 2;
}

// Função para obter valor por tipo
export function getValorPorTipo(tipo: TipoIngresso): number {
    return tipo === 'inteira' ? VALOR_INTEIRA : VALOR_MEIA;
}
