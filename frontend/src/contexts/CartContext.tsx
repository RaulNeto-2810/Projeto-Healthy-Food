// frontend/src/contexts/CartContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    productId: number;
    productName: string;
    producerName: string;
    producerId: number;
    producerUserId: number;  // ID do usuário produtor (necessário para o pedido)
    price: number;
    quantity: number;
    unit: string;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    getTotalPrice: () => number;
    getItemsByProducer: () => Map<string, CartItem[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addItem = (item: CartItem) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.productId === item.productId);

            if (existingItem) {
                // Se o item já existe, atualiza a quantidade
                return prevItems.map((i) =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                // Adiciona novo item
                return [...prevItems, item];
            }
        });
        setIsOpen(true);
    };

    const removeItem = (productId: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getItemsByProducer = () => {
        const grouped = new Map<string, CartItem[]>();

        items.forEach((item) => {
            const key = `${item.producerId}:${item.producerName}`;
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key)!.push(item);
        });

        return grouped;
    };

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                getTotalPrice,
                getItemsByProducer,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
