// frontend/src/pages/ProducerDashboardPage.tsx

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import styles from '../styles/modules/ProducerDashboardPage.module.css';

// Interfaces
interface DashboardMetrics {
    faturamento: string;
    novosPedidos: number;
    produtosAtivos: number;
    avaliacaoMedia: string;
}

interface Order {
    id: number;
    client_name: string;
    total_price: string;
    status: string;
    created_at: string;
}

interface Product {
    id: number;
    name: string;
    status: string;
}

interface ProducerProfile {
    average_rating: number;
    total_ratings: number;
}

interface SalesData {
    name: string;
    Vendas: number;
}

export function ProducerDashboardPage() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const headers = { 'Authorization': `Token ${token}` };

            // Buscar dados em paralelo
            const [ordersRes, productsRes, profileRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/orders/', { headers }),
                axios.get('http://127.0.0.1:8000/api/products/', { headers }),
                axios.get('http://127.0.0.1:8000/api/my-profile/', { headers })
            ]);

            const orders: Order[] = ordersRes.data;
            const products: Product[] = productsRes.data;
            const profile: ProducerProfile = profileRes.data;

            // Calcular métricas
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);

            // Faturamento do mês (pedidos entregues)
            const monthlyRevenue = orders
                .filter(o => o.status === 'Entregue' && new Date(o.created_at) >= startOfMonth)
                .reduce((sum, o) => sum + parseFloat(o.total_price), 0);

            // Novos pedidos da semana
            const weeklyOrders = orders.filter(o => new Date(o.created_at) >= startOfWeek).length;

            // Produtos ativos
            const activeProducts = products.filter(p => p.status === 'Ativo').length;

            // Avaliação média
            const avgRating = profile.average_rating > 0
                ? profile.average_rating.toFixed(1)
                : 'N/A';

            setMetrics({
                faturamento: `R$ ${monthlyRevenue.toFixed(2).replace('.', ',')}`,
                novosPedidos: weeklyOrders,
                produtosAtivos: activeProducts,
                avaliacaoMedia: avgRating
            });

            // Dados do gráfico - últimos 7 dias
            const salesByDay: { [key: string]: number } = {};
            const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dayName = daysOfWeek[date.getDay()];
                salesByDay[dayName] = 0;
            }

            orders.forEach(order => {
                const orderDate = new Date(order.created_at);
                if (orderDate >= startOfWeek && order.status === 'Entregue') {
                    const dayName = daysOfWeek[orderDate.getDay()];
                    salesByDay[dayName] += parseFloat(order.total_price);
                }
            });

            const chartData = Object.keys(salesByDay).map(day => ({
                name: day,
                Vendas: salesByDay[day]
            }));

            setSalesData(chartData);

            // Pedidos recentes (últimos 5)
            const recent = orders
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 5);

            setRecentOrders(recent);

        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            // Mantém valores vazios em caso de erro
            setMetrics({
                faturamento: 'R$ 0,00',
                novosPedidos: 0,
                produtosAtivos: 0,
                avaliacaoMedia: 'N/A'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.dashboardLayout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Header title="Dashboard" />
                <main className={styles.mainContent}>

                    {/* Cards de Métricas */}
                    <div className={styles.metricsGrid}>
                        <Card className={styles.metricCard}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? '...' : metrics?.faturamento}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {loading ? '---' : `Pedidos entregues em ${new Date().toLocaleDateString('pt-BR', { month: 'long' })}`}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={styles.metricCard}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Novos Pedidos (Semana)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? '...' : metrics?.novosPedidos}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {loading ? '---' : 'Últimos 7 dias'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={styles.metricCard}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? '...' : metrics?.produtosAtivos}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {loading ? '---' : 'Disponíveis para venda'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={styles.metricCard}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? '...' : `${metrics?.avaliacaoMedia} ⭐`}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {loading ? '---' : 'Baseado nas avaliações dos clientes'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gráfico e Tabela */}
                    <div className={styles.chartsGrid}>
                        <Card className={styles.chartCard}>
                            <CardHeader>
                                <CardTitle>Vendas na Última Semana</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={salesData}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                                        <YAxis stroke="#888888" fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="Vendas" fill="#16a34a" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className={styles.tableCard}>
                            <CardHeader>
                                <CardTitle>Pedidos Recentes</CardTitle>
                                <CardDescription>
                                    Os pedidos mais recentes aparecerão aqui.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Valor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-gray-500">
                                                    Carregando...
                                                </TableCell>
                                            </TableRow>
                                        ) : recentOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-gray-500">
                                                    Nenhum pedido recente.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            recentOrders.map((order: Order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{order.client_name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={
                                                            order.status === 'Entregue' ? 'default' :
                                                            order.status === 'Aceito' ? 'secondary' :
                                                            order.status === 'Cancelado' ? 'destructive' :
                                                            'outline'
                                                        }>
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        R$ {parseFloat(order.total_price).toFixed(2).replace('.', ',')}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                </main>
            </div>
        </div>
    );
}