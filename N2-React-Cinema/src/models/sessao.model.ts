import { z } from 'zod';
import type { IFilme } from './filme.model';
import type { ISala } from './sala.model';

export interface ISessao {
    id?: number;
    data: string; // formato YYYY-MM-DD
    horario: string; // formato HH:mm
    filme?: IFilme;
    filmeId: number;
    sala?: ISala;
    salaId: number;
}

export const sessaoSchema = z.object({
    id: z.number().optional(),
    data: z.string()
        .min(1, 'A data é obrigatória')
        .refine((data) => {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const dataSessao = new Date(data + 'T00:00:00');
            return dataSessao >= hoje;
        }, 'A data da sessão não pode ser retroativa (anterior à data atual)'),
    horario: z.string()
        .min(1, 'O horário é obrigatório'),
    filmeId: z.number()
        .min(1, 'Selecione um filme'),
    salaId: z.number()
        .min(1, 'Selecione uma sala')
});
