// frontend/src/components/forms/ProductForm.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from '@/types'; // <-- 1. IMPORTE AQUI
import styles from './ProductForm.module.css';

// 2. A 'interface Product' que estava aqui foi REMOVIDA

// Props que o formulário receberá
interface ProductFormProps {
    product?: Product | null;
    onSubmit: (productData: Product) => void;
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
    // Estado para controlar os dados do formulário
    const [formData, setFormData] = useState<Product>({
        name: '',
        category: '',
        status: 'Ativo',
        stock: 0,
        price: 0,
    });

    // useEffect para preencher o formulário quando um produto for passado para edição
    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            // Limpa o formulário se for para adicionar um novo
            setFormData({ name: '', category: '', status: 'Ativo', stock: 0, price: 0 });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSelectChange = (name: 'status' | 'category', value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.productForm}>
            <div className={styles.formField}>
                <Label htmlFor="name" className={styles.formLabel}>Nome</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className={styles.formField}>
                <Label htmlFor="category" className={styles.formLabel}>Categoria</Label>
                <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
                    <SelectTrigger className={styles.selectTrigger}>
                        <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Frutas e Legumes">Frutas e Legumes</SelectItem>
                        <SelectItem value="Verduras">Verduras</SelectItem>
                        <SelectItem value="Ovos e Laticínios">Ovos e Laticínios</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className={styles.formField}>
                <Label htmlFor="stock" className={styles.formLabel}>Estoque</Label>
                <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} />
            </div>
            <div className={styles.formField}>
                <Label htmlFor="price" className={styles.formLabel}>Preço</Label>
                <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
            </div>
            <div className={styles.formField}>
                <Label htmlFor="status" className={styles.formLabel}>Status</Label>
                <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status}>
                    <SelectTrigger className={styles.selectTrigger}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className={styles.buttonContainer}>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
}