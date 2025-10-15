// frontend/src/pages/MyProductsPage.tsx

import { useState } from "react";
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
import type { Product } from '@/types'; // <-- 1. IMPORTE AQUI

import dashboardStyles from '../styles/modules/ProducerDashboardPage.module.css';
import pageStyles from '../styles/modules/MyProductsPage.module.css';
import headerStyles from '@/components/layout/Header.module.css';

const initialProducts: Product[] = [
    { id: 'PROD-001', name: 'Tomate Orgânico (Kg)', status: 'Ativo', price: 12.50, category: 'Frutas e Legumes', stock: 50 },
    { id: 'PROD-002', name: 'Alface Crespa Hidropônica (Unidade)', status: 'Ativo', price: 4.00, category: 'Verduras', stock: 120 },
    { id: 'PROD-003', name: 'Ovos Caipiras (Dúzia)', status: 'Inativo', price: 15.00, category: 'Ovos e Laticínios', stock: 0 },
    { id: 'PROD-004', name: 'Queijo Minas Frescal (500g)', status: 'Ativo', price: 25.00, category: 'Ovos e Laticínios', stock: 20 },
    { id: 'PROD-005', name: 'Banana Prata Orgânica (Kg)', status: 'Ativo', price: 8.90, category: 'Frutas e Legumes', stock: 80 },
];

export function MyProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

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

    const handleFormSubmit = (productData: Product) => {
        if (editingProduct && editingProduct.id) {
            setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
        } else {
            const newProduct = { ...productData, id: `PROD-${Date.now()}` };
            setProducts([...products, newProduct]);
        }
        setIsDialogOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (deletingProductId) {
            setProducts(products.filter(p => p.id !== deletingProductId));
        }
        setIsAlertOpen(false);
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
                            <Table>
                                {/* O CABEÇALHO COMPLETO QUE ESTAVA FALTANDO */}
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
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            {/* AS CÉLULAS COMPLETAS QUE ESTAVAM FALTANDO */}
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
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </main>
            </div>

            {/* Pop-up (Dialog) de Adicionar/Editar Produto */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {/* ADICIONE A CLASSE AQUI */}
                <DialogContent className={pageStyles.dialogContent}>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
                    </DialogHeader>
                    <ProductForm product={editingProduct} onSubmit={handleFormSubmit} />
                </DialogContent>
            </Dialog>

            {/* Alerta de Confirmação para Deletar */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                {/* ADICIONE A CLASSE AQUI */}
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