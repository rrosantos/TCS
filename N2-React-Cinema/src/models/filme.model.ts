import { z } from 'zod';

// Enum de Gêneros conforme diagrama
export enum GeneroFilme {
    ACAO = 'Ação',
    AVENTURA = 'Aventura',
    COMEDIA = 'Comédia',
    DRAMA = 'Drama',
    TERROR = 'Terror',
    SUSPENSE = 'Suspense',
    FICCAO_CIENTIFICA = 'Ficção Científica',
    ROMANCE = 'Romance',
    ANIMACAO = 'Animação',
    DOCUMENTARIO = 'Documentário',
    MUSICAL = 'Musical',
    FANTASIA = 'Fantasia',
    FAMILIA = 'Família'
}

export interface IFilme {
    id?: number;
    titulo: string;
    sinopse: string;
    classificacao: string;
    duracao: number; // duração em minutos
    genero: GeneroFilme | string;
    dataInicialExibicao: string;
    dataFinalExibicao: string;
}

export const filmeSchema = z.object({
    id: z.number().optional(),
    titulo: z.string()
        .min(1, 'O título é obrigatório')
        .max(100, 'O título deve ter no máximo 100 caracteres'),
    sinopse: z.string()
        .min(10, 'A sinopse deve ter no mínimo 10 caracteres')
        .max(1000, 'A sinopse deve ter no máximo 1000 caracteres'),
    classificacao: z.string()
        .min(1, 'A classificação é obrigatória'),
    duracao: z.number()
        .positive('A duração deve ser um número positivo (maior que 0)'),
    genero: z.string().min(1, 'O gênero é obrigatório'),
    dataInicialExibicao: z.string()
        .min(1, 'A data inicial de exibição é obrigatória'),
    dataFinalExibicao: z.string()
        .min(1, 'A data final de exibição é obrigatória')
});

export const GENEROS = Object.values(GeneroFilme);

export const CLASSIFICACOES = [
    'Livre', '10 anos', '12 anos', '14 anos', '16 anos', '18 anos'
];
