// frontend/src/pages/ProducerDashboardPage.tsx

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../styles/modules/ProducerDashboardPage.module.css';

// Interfaces
interface DashboardMetrics {
    faturamento: string;
    novosPedidos: number;
    produtosAtivos: number;
    avaliacaoMedia: string;
}

interface Order {
    id: string;
    customer: string;
    amount: string;
    status: string;
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
        // Dados fictícios para demonstração
        setMetrics({
            faturamento: 'R$ 12.450,00',
            novosPedidos: 23,
            produtosAtivos: 18,
            avaliacaoMedia: '4.8'
        });

        setSalesData([
            { name: 'Seg', Vendas: 1850 },
            { name: 'Ter', Vendas: 2200 },
            { name: 'Qua', Vendas: 1950 },
            { name: 'Qui', Vendas: 2800 },
            { name: 'Sex', Vendas: 3100 },
            { name: 'Sáb', Vendas: 2650 },
            { name: 'Dom', Vendas: 1890 }
        ]);

        setRecentOrders([
            { id: '1', customer: 'Maria Silva', amount: 'R$ 145,00', status: 'Entregue' },
            { id: '2', customer: 'João Santos', amount: 'R$ 89,50', status: 'Em transporte' },
            { id: '3', customer: 'Ana Costa', amount: 'R$ 234,00', status: 'Preparando' },
            { id: '4', customer: 'Pedro Oliveira', amount: 'R$ 67,00', status: 'Entregue' },
            { id: '5', customer: 'Carla Mendes', amount: 'R$ 198,50', status: 'Preparando' }
        ]);

        setLoading(false);
    }, []);

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
                                <p className="text-xs text-green-600">+12% em relação ao mês anterior</p>
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
                                <p className="text-xs text-green-600">+8% em relação à semana anterior</p>
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
                                <p className="text-xs text-gray-500">Total no catálogo</p>
                            </CardContent>
                        </Card>

                        <Card className={styles.metricCard}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? '...' : metrics?.avaliacaoMedia} ⭐
                                </div>
                                <p className="text-xs text-gray-500">Baseado em 127 avaliações</p>
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
                                        {recentOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-gray-500">
                                                    Nenhum pedido recente.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            recentOrders.map((order: Order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{order.customer}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{order.status}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">{order.amount}</TableCell>
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
