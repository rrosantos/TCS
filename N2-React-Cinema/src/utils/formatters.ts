export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

export function formatTime(timeString: string): string {
    return timeString;
}

export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}
