import { z } from 'zod';
import type { ISala } from './sala.model';
import type { IFilme } from './filme.model';
import type { ISessao } from './sessao.model';

export interface ICinema {
    id: number;
    nome: string;
    endereco: string;
    listaSalas: ISala[];
    listaFilmes: IFilme[];
    listaSessao: ISessao[];
}

export const cinemaSchema = z.object({
    id: z.number().optional(),
    nome: z.string()
        .min(1, 'O nome é obrigatório')
        .max(100, 'O nome deve ter no máximo 100 caracteres'),
    endereco: z.string()
        .min(1, 'O endereço é obrigatório')
        .max(200, 'O endereço deve ter no máximo 200 caracteres'),
    listaSalas: z.array(z.any()).optional(),
    listaFilmes: z.array(z.any()).optional(),
    listaSessao: z.array(z.any()).optional()
});

// Funções auxiliares para Cinema
export function cadastrarSala(cinema: ICinema, sala: ISala): ICinema {
    return {
        ...cinema,
        listaSalas: [...cinema.listaSalas, sala]
    };
}

export function removerSala(cinema: ICinema, salaId: number): ICinema {
    return {
        ...cinema,
        listaSalas: cinema.listaSalas.filter(s => s.id !== salaId)
    };
}

export function cadastrarFilme(cinema: ICinema, filme: IFilme): ICinema {
    return {
        ...cinema,
        listaFilmes: [...cinema.listaFilmes, filme]
    };
}

export function removerFilme(cinema: ICinema, filmeId: number): ICinema {
    return {
        ...cinema,
        listaFilmes: cinema.listaFilmes.filter(f => f.id !== filmeId)
    };
}

export function cadastrarSessao(cinema: ICinema, sessao: ISessao): ICinema {
    return {
        ...cinema,
        listaSessao: [...cinema.listaSessao, sessao]
    };
}

export function removerSessao(cinema: ICinema, sessaoId: number): ICinema {
    return {
        ...cinema,
        listaSessao: cinema.listaSessao.filter(s => s.id !== sessaoId)
    };
}

export function criarCinemaVazio(): Omit<ICinema, 'id'> {
    return {
        nome: '',
        endereco: '',
        listaSalas: [],
        listaFilmes: [],
        listaSessao: []
    };
}
