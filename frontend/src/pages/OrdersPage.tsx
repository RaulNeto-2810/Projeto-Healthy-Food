// frontend/src/pages/OrdersPage.tsx
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosConfig";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IonIcon } from "@ionic/react";
import { checkmarkCircleOutline, closeCircleOutline, checkmarkDoneOutline } from "ionicons/icons";

import styles from '../styles/modules/ProducerDashboardPage.module.css';
import pageStyles from '../styles/modules/OrdersPage.module.css';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Order {
    id: number;
    client_name: string;
    client_phone: string;
    client_email?: string;
    status: 'Pendente' | 'Aceito' | 'Cancelado' | 'Entregue';
    total_price: number;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
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

export function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/api/orders/');
            setOrders(response.data);
        } catch (err: any) {
            if (err.response?.status !== 401) {
                setError("Não foi possível carregar os pedidos.");
            }
            console.error("Erro ao buscar pedidos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            await axiosInstance.patch(`/api/orders/${orderId}/update_status/`, {
                status: newStatus
            });
            fetchOrders(); // Recarrega a lista
        } catch (err: any) {
            console.error("Erro ao atualizar status:", err);
            alert("Erro ao atualizar status do pedido.");
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Pendente':
                return 'secondary';
            case 'Aceito':
                return 'default';
            case 'Entregue':
                return 'default';
            case 'Cancelado':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <div className={styles.dashboardLayout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Header title="Pedidos" />
                <main className={styles.mainContent}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerenciar Pedidos</CardTitle>
                            <CardDescription>
                                Visualize e gerencie os pedidos recebidos dos seus clientes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading && <p className="text-center text-gray-500">Carregando pedidos...</p>}
                            {error && <p className="text-center text-red-500">{error}</p>}
                            {!loading && !error && orders.length === 0 && (
                                <p className="text-center text-gray-500">Nenhum pedido recebido ainda.</p>
                            )}
                            {!loading && !error && orders.length > 0 && (
                                <div className={pageStyles.ordersContainer}>
                                    {orders.map((order) => (
                                        <div key={order.id} className={pageStyles.orderCard}>
                                            <div className={pageStyles.orderHeader}>
                                                <div className={pageStyles.orderInfo}>
                                                    <h3 className={pageStyles.orderTitle}>Pedido #{order.id}</h3>
                                                    <Badge variant={getStatusBadgeVariant(order.status)} className={pageStyles.statusBadge}>
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                                <p className={pageStyles.orderDate}>{formatDate(order.created_at)}</p>
                                            </div>

                                            <div className={pageStyles.clientInfo}>
                                                <h4 className={pageStyles.clientTitle}>Informações do Cliente:</h4>
                                                <p><strong>Nome:</strong> {order.client_name}</p>
                                                <p><strong>Telefone:</strong> {order.client_phone}</p>
                                                {order.client_email && <p><strong>E-mail:</strong> {order.client_email}</p>}
                                            </div>

                                            <div className={pageStyles.itemsList}>
                                                <h4 className={pageStyles.itemsTitle}>Itens do Pedido:</h4>
                                                {order.items.map((item) => (
                                                    <div key={item.id} className={pageStyles.orderItem}>
                                                        <span className={pageStyles.itemName}>
                                                            {item.quantity}x {item.product_name}
                                                        </span>
                                                        <span className={pageStyles.itemPrice}>
                                                            R$ {formatPrice(item.subtotal)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={pageStyles.orderTotal}>
                                                <strong>Total:</strong>
                                                <strong className={pageStyles.totalPrice}>R$ {formatPrice(order.total_price)}</strong>
                                            </div>

                                            <div className={pageStyles.orderActions}>
                                                {order.status === 'Pendente' && (
                                                    <>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(order.id, 'Aceito')}
                                                            className={pageStyles.acceptButton}
                                                        >
                                                            <IonIcon icon={checkmarkCircleOutline} />
                                                            Aceitar Pedido
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(order.id, 'Cancelado')}
                                                            className={pageStyles.cancelButton}
                                                        >
                                                            <IonIcon icon={closeCircleOutline} />
                                                            Cancelar Pedido
                                                        </Button>
                                                    </>
                                                )}

                                                {order.status === 'Aceito' && (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(order.id, 'Entregue')}
                                                        className={pageStyles.deliverButton}
                                                    >
                                                        <IonIcon icon={checkmarkDoneOutline} />
                                                        Marcar como Entregue
                                                    </Button>
                                                )}

                                                {(order.status === 'Cancelado' || order.status === 'Entregue') && (
                                                    <p className={pageStyles.statusMessage}>
                                                        {order.status === 'Cancelado' && 'Este pedido foi cancelado.'}
                                                        {order.status === 'Entregue' && 'Este pedido foi concluído.'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
