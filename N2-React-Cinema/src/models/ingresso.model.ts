import { z } from 'zod';
import type { ISessao } from './sessao.model';

export interface IIngresso {
    id: number;
    valorInteira: number;
    valorMeia: number;
    sessao?: ISessao;
    sessaoId: number;
}

export const ingressoSchema = z.object({
    id: z.number().optional(),
    valorInteira: z.number()
        .min(0.01, 'O valor da inteira deve ser maior que zero'),
    valorMeia: z.number()
        .min(0.01, 'O valor da meia deve ser maior que zero'),
    sessaoId: z.number()
        .min(1, 'A sessão é obrigatória')
});

// Função para calcular valor da meia automaticamente (50%)
export function calcularMeia(valorInteira: number): number {
    return valorInteira / 2;
}
