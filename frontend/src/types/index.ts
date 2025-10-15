// frontend/src/types/index.ts

export interface Product {
    id?: string; // O ID é opcional, pois um novo produto ainda não tem ID
    name: string;
    status: 'Ativo' | 'Inativo';
    price: number;
    category: string;
    stock: number;
}