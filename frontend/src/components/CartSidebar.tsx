// frontend/src/components/CartSidebar.tsx

import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useCart } from '@/contexts/CartContext';
import apiClient from '@/lib/axiosConfig';
import styles from './CartSidebar.module.css';

// Função para formatar valores em reais
const formatPrice = (value: number): string => {
    return value.toFixed(2).replace('.', ',');
};

export function CartSidebar() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getItemsByProducer, clearCart } = useCart();
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedProducer, setSelectedProducer] = useState<{ id: number; name: string; items: typeof items } | null>(null);
    const [clientInfo, setClientInfo] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const groupedItems = getItemsByProducer();
    const total = getTotalPrice();

    const handleOpenOrderModal = (producerId: number, producerName: string, producerItems: typeof items) => {
        // Pega o producerUserId do primeiro item (todos os itens do mesmo produtor têm o mesmo userId)
        const producerUserId = producerItems[0]?.producerUserId || producerId;
        setSelectedProducer({ id: producerUserId, name: producerName, items: producerItems });

        // Pré-preenche os dados do cliente se existirem no localStorage
        const savedClientInfo = localStorage.getItem('clientInfo');
        if (savedClientInfo) {
            try {
                const parsedInfo = JSON.parse(savedClientInfo);
                setClientInfo({
                    name: parsedInfo.name || '',
                    phone: parsedInfo.phone || '',
                    email: parsedInfo.email || ''
                });
            } catch (error) {
                console.error('Erro ao carregar informações do cliente:', error);
            }
        }

        setShowOrderModal(true);
    };

    const handleCloseOrderModal = () => {
        setShowOrderModal(false);
        setSelectedProducer(null);
        setClientInfo({ name: '', phone: '', email: '' });
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProducer) return;

        setIsSubmitting(true);

        try {
            // Calcula o total do pedido
            const orderTotal = selectedProducer.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            // Monta os itens do pedido
            const orderItems = selectedProducer.items.map(item => ({
                product: item.productId,
                product_name: item.productName,
                quantity: item.quantity,
                unit_price: item.price,
                subtotal: item.price * item.quantity
            }));

            // Envia o pedido para a API
            const orderData = {
                producer: selectedProducer.id,
                client_name: clientInfo.name,
                client_phone: clientInfo.phone,
                client_email: clientInfo.email,
                total_price: orderTotal,
                items: orderItems
            };

            await apiClient.post('/api/orders/', orderData);

            // Salva as informações do cliente no localStorage para uso posterior
            localStorage.setItem('clientInfo', JSON.stringify({
                name: clientInfo.name,
                phone: clientInfo.phone,
                email: clientInfo.email
            }));

            // Remove os itens do carrinho apenas deste produtor
            selectedProducer.items.forEach(item => {
                removeItem(item.productId);
            });

            alert('Pedido enviado com sucesso! O produtor receberá sua solicitação.');
            handleCloseOrderModal();
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
            alert('Erro ao enviar pedido. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div className={styles.overlay} onClick={closeCart} />

            {/* Sidebar */}
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Carrinho de Compras</h2>
                    <button className={styles.closeButton} onClick={closeCart}>
                        <IonIcon icon={close} />
                    </button>
                </div>

                <div className={styles.content}>
                    {items.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <p>Seu carrinho está vazio</p>
                        </div>
                    ) : (
                        <>
                            {Array.from(groupedItems.entries()).map(([key, producerItems]) => {
                                const [producerId, producerName] = key.split(':');
                                const producerTotal = producerItems.reduce(
                                    (sum, item) => sum + item.price * item.quantity,
                                    0
                                );

                                return (
                                    <div key={key} className={styles.producerGroup}>
                                        <h3 className={styles.producerTitle}>Pedido feito em:</h3>
                                        <h2 className={styles.producerName}>{producerName}</h2>
                                        <p className={styles.producerSubtitle}>Descrição:</p>

                                        <div className={styles.itemsList}>
                                            {producerItems.map((item) => (
                                                <div key={item.productId} className={styles.cartItem}>
                                                    <div className={styles.itemInfo}>
                                                        <div className={styles.itemHeader}>
                                                            <span className={styles.itemName}>
                                                                - {item.quantity}{item.unit} de {item.productName}
                                                            </span>
                                                            <span className={styles.itemPrice}>
                                                                R${formatPrice(item.price * item.quantity)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.itemActions}>
                                                            <button
                                                                className={styles.removeButton}
                                                                onClick={() => removeItem(item.productId)}
                                                            >
                                                                🗑️ Remover
                                                            </button>
                                                            <div className={styles.quantityControl}>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) =>
                                                                        updateQuantity(item.productId, parseInt(e.target.value) || 1)
                                                                    }
                                                                    className={styles.quantityInput}
                                                                />
                                                                <span className={styles.unit}>{item.unit}.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.producerFooter}>
                                            <div className={styles.producerTotal}>
                                                <span>Subtotal: R$ {formatPrice(producerTotal)}</span>
                                            </div>
                                            <button
                                                className={styles.orderButton}
                                                onClick={() => handleOpenOrderModal(parseInt(producerId), producerName, producerItems)}
                                            >
                                                Enviar Pedido
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span className={styles.totalLabel}>Total:</span>
                            <span className={styles.totalPrice}>R$ {formatPrice(total)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Pedido */}
            {showOrderModal && selectedProducer && (
                <div className={styles.modalOverlay} onClick={handleCloseOrderModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Finalizar Pedido</h2>
                            <button className={styles.modalCloseButton} onClick={handleCloseOrderModal}>
                                <IonIcon icon={close} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitOrder} className={styles.modalForm}>
                            <div className={styles.orderSummary}>
                                <h3>Resumo do Pedido</h3>
                                <p><strong>Produtor:</strong> {selectedProducer.name}</p>
                                <div className={styles.orderItems}>
                                    {selectedProducer.items.map((item) => (
                                        <div key={item.productId} className={styles.orderItem}>
                                            <span>{item.quantity}{item.unit} de {item.productName}</span>
                                            <span>R$ {formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.orderTotalLine}>
                                    <strong>Total:</strong>
                                    <strong>R$ {formatPrice(selectedProducer.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</strong>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="clientName">Nome Completo *</label>
                                <input
                                    id="clientName"
                                    type="text"
                                    value={clientInfo.name}
                                    onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                                    required
                                    placeholder="Digite seu nome"
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="clientPhone">Telefone *</label>
                                <input
                                    id="clientPhone"
                                    type="tel"
                                    value={clientInfo.phone}
                                    onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                                    required
                                    placeholder="(00) 00000-0000"
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="clientEmail">E-mail (opcional)</label>
                                <input
                                    id="clientEmail"
                                    type="email"
                                    value={clientInfo.email}
                                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                                    placeholder="seu@email.com"
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={handleCloseOrderModal}
                                    className={styles.cancelButton}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Confirmar Pedido'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
