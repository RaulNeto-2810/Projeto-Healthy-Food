// frontend/src/pages/MyProductsPage.tsx

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosConfig";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ProductForm } from "@/components/forms/ProductForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { IonIcon } from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import type { Product } from '@/types';

import dashboardStyles from '../styles/modules/ProducerDashboardPage.module.css';
import pageStyles from '../styles/modules/MyProductsPage.module.css';
import headerStyles from '@/components/layout/Header.module.css';

export function MyProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/api/products/');
            setProducts(response.data);
        } catch (err: any) {
            // Se for erro 401, o interceptor já vai redirecionar para login
            if (err.response?.status !== 401) {
                setError("Não foi possível carregar os produtos.");
            }
            console.error("Erro ao buscar produtos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenAddDialog = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleOpenDeleteAlert = (productId: string) => {
        setDeletingProductId(productId);
        setIsAlertOpen(true);
    };

    const handleFormSubmit = async (productData: Product) => {
        try {
            if (editingProduct && editingProduct.id) {
                await axiosInstance.put(`/api/products/${editingProduct.id}/`, productData);
            } else {
                await axiosInstance.post('/api/products/', productData);
            }
            setIsDialogOpen(false);
            fetchProducts();
        } catch (err: any) {
            console.error("Erro ao salvar o produto:", err);

            // Tratamento de erros mais específico
            // 401 já é tratado pelo interceptor
            if (err.response?.status === 403) {
                alert("Você não tem permissão para realizar esta ação.");
            } else if (err.response?.data && err.response?.status !== 401) {
                // Mostra erros de validação do backend
                const errorMessages = Object.values(err.response.data).flat().join('\n');
                alert(`Erro ao salvar produto:\n${errorMessages}`);
            } else if (err.response?.status !== 401) {
                alert("Falha ao salvar o produto. Verifique os dados e tente novamente.");
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (deletingProductId) {
            try {
                await axiosInstance.delete(`/api/products/${deletingProductId}/`);
                setIsAlertOpen(false);
                fetchProducts();
            } catch (err: any) {
                console.error("Erro ao deletar o produto:", err);

                // Tratamento de erros mais específico
                // 401 já é tratado pelo interceptor
                if (err.response?.status === 403) {
                    alert("Você não tem permissão para deletar este produto.");
                } else if (err.response?.status === 404) {
                    alert("Produto não encontrado.");
                } else if (err.response?.status !== 401) {
                    alert("Falha ao deletar o produto.");
                }
            }
        }
    };

    return (
        <div className={dashboardStyles.dashboardLayout}>
            <Sidebar />
            <div className={dashboardStyles.mainWrapper}>
                <Header
                    title="Meus Produtos"
                    actions={
                        <button className={headerStyles.addButton} onClick={handleOpenAddDialog}>
                            + Adicionar Produto
                        </button>
                    }
                />
                <main className={dashboardStyles.mainContent}>
                    <Card>
                        <CardHeader className={pageStyles.cardHeader}>
                            <CardTitle>Produtos Cadastrados</CardTitle>
                            <CardDescription>
                                Gerencie os produtos da sua loja. Adicione, edite ou remova itens do seu catálogo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={pageStyles.cardHeader}>
                            {loading && <p className="text-center text-gray-500">Carregando produtos...</p>}
                            {error && <p className="text-center text-red-500">{error}</p>}
                            {!loading && !error && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className={pageStyles.tableHead}>Produto</TableHead>
                                            <TableHead className={pageStyles.tableHead}>Categoria</TableHead>
                                            <TableHead className={pageStyles.tableHead}>Status</TableHead>
                                            <TableHead className={pageStyles.tableHeadCenter}>Estoque</TableHead>
                                            <TableHead className={pageStyles.tableHeadRight}>Preço</TableHead>
                                            <TableHead className={pageStyles.tableHeadRight}>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-gray-500 h-24">Nenhum produto cadastrado.</TableCell>
                                            </TableRow>
                                        ) : (
                                            products.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className={pageStyles.tableCellMedium}>{product.name}</TableCell>
                                                    <TableCell className={pageStyles.tableCell}>{product.category}</TableCell>
                                                    <TableCell className={pageStyles.tableCell}>
                                                        <Badge variant={product.status === 'Ativo' ? 'default' : 'destructive'} className={pageStyles.statusBadge}>
                                                            {product.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className={pageStyles.tableCellCenter}>{product.stock}</TableCell>
                                                    <TableCell className={pageStyles.tableCellRight}>
                                                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </TableCell>
                                                    <TableCell className={pageStyles.tableCellActions}>
                                                        <div className={pageStyles.actionsContainer}>
                                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(product)}>
                                                                <IonIcon icon={createOutline} className={pageStyles.iconButton} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className={pageStyles.deleteButton} onClick={() => handleOpenDeleteAlert(product.id!)}>
                                                                <IonIcon icon={trashOutline} className={pageStyles.iconButton} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className={pageStyles.dialogContent}>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
                    </DialogHeader>
                    <ProductForm product={editingProduct} onSubmit={handleFormSubmit} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className={pageStyles.alertDialogContent}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso irá deletar permanentemente o produto.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Deletar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}