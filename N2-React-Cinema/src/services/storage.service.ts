// Service genérico para localStorage com IDs numéricos
export class StorageService<T extends { id?: number }> {
    private key: string;
    private nextId: number = 1;

    constructor(key: string) {
        this.key = key;
        this.initNextId();
    }

    private initNextId(): void {
        const items = this.findAll();
        if (items.length > 0) {
            const maxId = Math.max(...items.map(item => item.id || 0));
            this.nextId = maxId + 1;
        }
    }

    findAll(): T[] {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }

    findById(id: number): T | undefined {
        const items = this.findAll();
        return items.find(item => item.id === id);
    }

    create(item: Omit<T, 'id'>): T {
        const items = this.findAll();
        const newItem = { ...item, id: this.nextId++ } as T;
        items.push(newItem);
        localStorage.setItem(this.key, JSON.stringify(items));
        return newItem;
    }

    update(id: number, item: Partial<T>): T | null {
        const items = this.findAll();
        const index = items.findIndex(i => i.id === id);
        if (index === -1) return null;
        
        items[index] = { ...items[index], ...item };
        localStorage.setItem(this.key, JSON.stringify(items));
        return items[index];
    }

    delete(id: number): boolean {
        const items = this.findAll();
        const filtered = items.filter(item => item.id !== id);
        if (filtered.length === items.length) return false;
        
        localStorage.setItem(this.key, JSON.stringify(filtered));
        return true;
    }

    clear(): void {
        localStorage.removeItem(this.key);
    }
}

// Instâncias dos serviços
import type { IFilme } from '../models/filme.model';
import type { ISala } from '../models/sala.model';
import type { ISessao } from '../models/sessao.model';
import type { IIngresso } from '../models/ingresso.model';
import type { ICinema } from '../models/cinema.model';
import type { IPedido } from '../models/pedido.model';
import type { ILancheCombo } from '../models/lancheCombo.model';

export const filmeService = new StorageService<IFilme>('filmes');
export const salaService = new StorageService<ISala>('salas');
export const sessaoService = new StorageService<ISessao>('sessoes');
export const ingressoService = new StorageService<IIngresso>('ingressos');
export const cinemaService = new StorageService<ICinema>('cinema');
export const pedidoService = new StorageService<IPedido>('pedidos');
export const lancheComboService = new StorageService<ILancheCombo>('lanches');

