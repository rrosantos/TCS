import { z } from 'zod';
import type { IIngresso } from './ingresso.model';
import type { ILancheCombo } from './lancheCombo.model';

// Tipo base do pedido (sem id, para uso durante construção)
export interface IPedidoBase {
    qtInteira: number;
    qtMeia: number;
    ingresso: IIngresso[];
    lanche: ILancheCombo[];
    valorTotal: number;
}

export interface IPedido extends IPedidoBase {
    id: number;
}

export const pedidoSchema = z.object({
    id: z.number().optional(),
    qtInteira: z.number()
        .min(0, 'A quantidade não pode ser negativa'),
    qtMeia: z.number()
        .min(0, 'A quantidade não pode ser negativa'),
    ingresso: z.array(z.any()).optional(),
    lanche: z.array(z.any()).optional(),
    valorTotal: z.number().optional()
});

// Funções auxiliares para Pedido - aceitam tanto IPedido quanto IPedidoBase
export function adicionarIngresso<T extends IPedidoBase>(pedido: T, ingresso: IIngresso): T {
    const novoIngresso = [...pedido.ingresso, ingresso];
    return {
        ...pedido,
        ingresso: novoIngresso,
        valorTotal: calcularValorTotalInterno({
            ...pedido,
            ingresso: novoIngresso
        })
    };
}

export function removerIngresso<T extends IPedidoBase>(pedido: T, index: number): T {
    const novosIngressos = pedido.ingresso.filter((_, i) => i !== index);
    return {
        ...pedido,
        ingresso: novosIngressos,
        valorTotal: calcularValorTotalInterno({
            ...pedido,
            ingresso: novosIngressos
        })
    };
}

export function adicionarLanche<T extends IPedidoBase>(pedido: T, lanche: ILancheCombo): T {
    const novosLanches = [...pedido.lanche, lanche];
    return {
        ...pedido,
        lanche: novosLanches,
        valorTotal: calcularValorTotalInterno({
            ...pedido,
            lanche: novosLanches
        })
    };
}

export function removerLanche<T extends IPedidoBase>(pedido: T, index: number): T {
    const novosLanches = pedido.lanche.filter((_, i) => i !== index);
    return {
        ...pedido,
        lanche: novosLanches,
        valorTotal: calcularValorTotalInterno({
            ...pedido,
            lanche: novosLanches
        })
    };
}

function calcularValorTotalInterno(pedido: IPedidoBase): number {
    // Soma dos ingressos
    const totalIngressos = pedido.ingresso.reduce((total, ing) => {
        return total + ing.valorInteira; // Cada ingresso no array é um ingresso vendido
    }, 0);
    
    // Soma dos lanches
    const totalLanches = pedido.lanche.reduce((total, lanche) => {
        return total + lanche.subtotal;
    }, 0);
    
    return totalIngressos + totalLanches;
}

export function calcularTotal<T extends IPedidoBase>(pedido: T): T {
    return {
        ...pedido,
        valorTotal: calcularValorTotalInterno(pedido)
    };
}

export function criarPedidoVazio(): IPedidoBase {
    return {
        qtInteira: 0,
        qtMeia: 0,
        ingresso: [],
        lanche: [],
        valorTotal: 0
    };
}
