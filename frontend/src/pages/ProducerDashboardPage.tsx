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
        // TODO: No futuro, aqui faremos a chamada à API para buscar os dados reais.
        // Por enquanto, inicializamos os dados como vazios/zerados.
        setMetrics({
            faturamento: 'R$ 0,00',
            novosPedidos: 0,
            produtosAtivos: 0,
            avaliacaoMedia: 'N/A'
        });

        setSalesData([]); // Gráfico vazio
        setRecentOrders([]); // Tabela vazia

        setLoading(false); // Termina o carregamento
    }, []); // O array vazio [] garante que isso rode apenas uma vez

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
                                <p className="text-xs text-gray-500">---</p>
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
                                <p className="text-xs text-gray-500">---</p>
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
                                <p className="text-xs text-gray-500">---</p>
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
                                <p className="text-xs text-gray-500">---</p>
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