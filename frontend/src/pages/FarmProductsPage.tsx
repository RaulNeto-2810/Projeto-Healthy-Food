// frontend/src/pages/FarmProductsPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/lib/axiosConfig";
import { DashboardTopbar } from "@/components/DashboardTopbar";
import { Footer } from "@/components/Footer";
import styles from "../styles/modules/FarmProductsPage.module.css";

// Interface para os dados do produtor
interface ProducerData {
    id: number;
    name: string;
    user_id: number;
}

// Interface para os dados do produto
interface ProductData {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    category: string;
    image?: string;
}

export function FarmProductsPage() {
    const { producerId } = useParams<{ producerId: string }>();
    const navigate = useNavigate();
    const [producer, setProducer] = useState<ProducerData | null>(null);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Buscar informações do produtor
                const producerResponse = await apiClient.get(`/api/producers/${producerId}/`);
                setProducer(producerResponse.data);

                // Buscar produtos do produtor
                const productsResponse = await apiClient.get(`/api/producers/${producerId}/products/`);
                setProducts(productsResponse.data);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                const error = err as { response?: { status?: number } };
                if (error.response?.status !== 401) {
                    setError("Não foi possível carregar os dados da fazenda.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (producerId) {
            fetchData();
        }
    }, [producerId]);

    if (loading) {
        return (
            <div className={styles.pageLayout}>
                <DashboardTopbar />
                <main className={styles.mainContent}>
                    <p className={styles.loadingText}>Carregando...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageLayout}>
                <DashboardTopbar />
                <main className={styles.mainContent}>
                    <p className={styles.errorText}>{error}</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageLayout}>
            <DashboardTopbar />

            <main className={styles.mainContent}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb}>
                    <button onClick={() => navigate('/dashboard-cliente')} className={styles.breadcrumbLink}>
                        Página Inicial
                    </button>
                    <span className={styles.breadcrumbSeparator}>›</span>
                    <span className={styles.breadcrumbCurrent}>
                        {producer?.name || "Carregando..."}
                    </span>
                </nav>

                {/* Cabeçalho da Fazenda */}
                <div className={styles.farmHeader}>
                    <h1 className={styles.farmName}>{producer?.name || "Fazenda"}</h1>
                    <div className={styles.farmInfo}>
                        <span className={styles.farmLocation}>📍 Ituiutaba - MG</span>
                        <div className={styles.farmRating}>
                            <span>Avaliação:</span>
                            <div className={styles.stars}>💚💚💚🤍🤍</div>
                        </div>
                    </div>
                </div>

                {/* Lista de Produtos */}
                <div className={styles.productsSection}>
                    <h2 className={styles.sectionTitle}>Produtos Disponíveis</h2>

                    {products.length === 0 ? (
                        <div className={styles.noProducts}>
                            <p className={styles.noProductsText}>
                                Esta fazenda ainda não possui produtos listados.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.productsGrid}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div className={styles.productImage}>
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>📦</div>
                                        )}
                                    </div>
                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <p className={styles.productCategory}>{product.category}</p>
                                        <p className={styles.productQuantity}>Quantidade: {product.stock}kg</p>
                                        <p className={styles.productPrice}>Preço /kg: R$ {parseFloat(product.price).toFixed(2)}</p>
                                        <div className={styles.productActions}>
                                            <button className={styles.decrementBtn}>-</button>
                                            <span className={styles.quantity}>1</span>
                                            <button className={styles.incrementBtn}>+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
