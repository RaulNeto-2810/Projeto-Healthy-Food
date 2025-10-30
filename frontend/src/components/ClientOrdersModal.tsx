// frontend/src/components/ClientOrdersModal.tsx

import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import apiClient from '@/lib/axiosConfig';
import styles from './ClientOrdersModal.module.css';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Order {
    id: number;
    producer_name: string;
    client_name: string;
    client_phone: string;
    status: 'Pendente' | 'Aceito' | 'Cancelado' | 'Entregue';
    total_price: number;
    items: OrderItem[];
    created_at: string;
    has_rating?: boolean;
    rating_score?: number;
}

interface ClientOrdersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const formatPrice = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toFixed(2).replace('.', ',');
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusColor = (status: string): string => {
    switch (status) {
        case 'Pendente':
            return styles.statusPendente;
        case 'Aceito':
            return styles.statusAceito;
        case 'Entregue':
            return styles.statusEntregue;
        case 'Cancelado':
            return styles.statusCancelado;
        default:
            return '';
    }
};

export function ClientOrdersModal({ isOpen, onClose }: ClientOrdersModalProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);

    // Buscar pedidos quando o modal abre
    useEffect(() => {
        if (isOpen) {
            fetchOrders();
        }
    }, [isOpen]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            // Como o cliente não está autenticado, vamos buscar pelo nome/telefone
            // armazenado no localStorage
            const clientInfo = localStorage.getItem('clientInfo');
            if (!clientInfo) {
                setOrders([]);
                return;
            }

            const { phone } = JSON.parse(clientInfo);
            const response = await apiClient.get(`/api/orders/?client_phone=${phone}`);
            setOrders(response.data);
        } catch (err) {
            console.error("Erro ao buscar pedidos:", err);
            setError("Não foi possível carregar seus pedidos.");
        } finally {
            setLoading(false);
        }
    };

    const openRatingModal = (order: Order) => {
        setSelectedOrder(order);
        setRating(0);
        setHoveredRating(0);
        setComment('');
        setRatingModalOpen(true);
    };

    const closeRatingModal = () => {
        setRatingModalOpen(false);
        setSelectedOrder(null);
        setRating(0);
        setComment('');
    };

    const submitRating = async () => {
        if (!selectedOrder || rating === 0) {
            alert('Por favor, selecione uma avaliação.');
            return;
        }

        setSubmittingRating(true);
        try {
            const clientInfo = localStorage.getItem('clientInfo');
            if (!clientInfo) {
                throw new Error('Informações do cliente não encontradas');
            }

            const { name, phone } = JSON.parse(clientInfo);

            await apiClient.post('/api/ratings/', {
                order_id: selectedOrder.id,
                client_name: name,
                client_phone: phone,
                score: rating,
                comment: comment || ''
            });

            alert('Avaliação enviada com sucesso! Obrigado pelo seu feedback.');
            closeRatingModal();
            fetchOrders(); // Recarrega os pedidos para atualizar o status de avaliação
        } catch (err: any) {
            console.error('Erro ao enviar avaliação:', err);
            if (err.response?.data?.order_id) {
                alert(err.response.data.order_id[0] || 'Erro ao enviar avaliação.');
            } else {
                alert('Erro ao enviar avaliação. Tente novamente.');
            }
        } finally {
            setSubmittingRating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Modal */}
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Meus Pedidos</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <IonIcon icon={close} />
                    </button>
                </div>

                <div className={styles.content}>
                    {loading && (
                        <div className={styles.emptyState}>
                            <p>Carregando seus pedidos...</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.emptyState}>
                            <p className={styles.errorText}>{error}</p>
                        </div>
                    )}

                    {!loading && !error && orders.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>Você ainda não fez nenhum pedido.</p>
                            <p className={styles.emptySubtext}>
                                Adicione produtos ao carrinho e faça seu primeiro pedido!
                            </p>
                        </div>
                    )}

                    {!loading && !error && orders.length > 0 && (
                        <div className={styles.ordersList}>
                            {orders.map((order) => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <div>
                                            <h3 className={styles.orderTitle}>Pedido #{order.id}</h3>
                                            <p className={styles.producerName}>{order.producer_name}</p>
                                        </div>
                                        <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <p className={styles.orderDate}>{formatDate(order.created_at)}</p>

                                    <div className={styles.itemsList}>
                                        {order.items.map((item) => (
                                            <div key={item.id} className={styles.item}>
                                                <span className={styles.itemName}>
                                                    {item.quantity}x {item.product_name}
                                                </span>
                                                <span className={styles.itemPrice}>
                                                    R$ {formatPrice(item.subtotal)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.orderTotal}>
                                        <strong>Total:</strong>
                                        <strong className={styles.totalPrice}>
                                            R$ {formatPrice(order.total_price)}
                                        </strong>
                                    </div>

                                    {/* Botão de Avaliar */}
                                    {order.status === 'Entregue' && !order.has_rating && (
                                        <button
                                            className={styles.rateButton}
                                            onClick={() => openRatingModal(order)}
                                        >
                                            ⭐ Avaliar Produtor
                                        </button>
                                    )}

                                    {/* Mostra avaliação já feita */}
                                    {order.has_rating && order.rating_score && (
                                        <div className={styles.ratedBadge}>
                                            ✅ Você avaliou com {order.rating_score} estrela{order.rating_score > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Avaliação */}
            {ratingModalOpen && selectedOrder && (
                <>
                    <div className={styles.ratingOverlay} onClick={closeRatingModal} />
                    <div className={styles.ratingModal}>
                        <div className={styles.ratingHeader}>
                            <h3>Avaliar {selectedOrder.producer_name}</h3>
                            <button className={styles.closeButton} onClick={closeRatingModal}>
                                <IonIcon icon={close} />
                            </button>
                        </div>

                        <div className={styles.ratingContent}>
                            <p className={styles.ratingLabel}>Como foi sua experiência?</p>

                            <div className={styles.starsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        className={styles.starButton}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <span className={styles.star}>
                                            {star <= (hoveredRating || rating) ? '⭐' : '☆'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className={styles.commentTextarea}
                                placeholder="Deixe um comentário (opcional)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                maxLength={500}
                            />

                            <div className={styles.ratingActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={closeRatingModal}
                                    disabled={submittingRating}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.submitButton}
                                    onClick={submitRating}
                                    disabled={rating === 0 || submittingRating}
                                >
                                    {submittingRating ? 'Enviando...' : 'Enviar Avaliação'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
