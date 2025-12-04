import { z } from 'zod';

export interface ISala {
    id?: number;
    numero: number;
    capacidade: number;
}

export const salaSchema = z.object({
    id: z.number().optional(),
    numero: z.number()
        .min(1, 'O número da sala é obrigatório'),
    capacidade: z.number()
        .min(1, 'A capacidade mínima é 1')
        .max(1000, 'A capacidade máxima é 1000')
});
