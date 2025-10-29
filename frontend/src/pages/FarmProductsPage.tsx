// frontend/src/pages/FarmProductsPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/lib/axiosConfig";
import { DashboardTopbar } from "@/components/DashboardTopbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import styles from "../styles/modules/FarmProductsPage.module.css";

// Função para formatar valores em reais
const formatPrice = (value: number): string => {
    return value.toFixed(2).replace('.', ',');
};

// Interface para os dados do produtor
interface ProducerData {
    id: number;
    name: string;
    user_id: number;
    city?: string;
    phone?: string;
    address?: string;
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
    const { addItem } = useCart();
    const [producer, setProducer] = useState<ProducerData | null>(null);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});

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

    // Filtra produtos baseado no termo de busca
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    // Inicializa quantidades dos produtos
    useEffect(() => {
        if (products.length > 0) {
            const initialQuantities: Record<number, number> = {};
            products.forEach(product => {
                initialQuantities[product.id] = 1;
            });
            setProductQuantities(initialQuantities);
        }
    }, [products]);

    const handleQuantityChange = (productId: number, delta: number) => {
        setProductQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta)
        }));
    };

    const handleAddToCart = (product: ProductData) => {
        if (!producer) return;

        const quantity = productQuantities[product.id] || 1;
        addItem({
            productId: product.id,
            productName: product.name,
            producerName: producer.name,
            producerId: producer.id,
            producerUserId: producer.user_id,  // Passa o user_id do produtor
            price: parseFloat(product.price),
            quantity: quantity,
            unit: 'kg'
        });
    };

    if (loading) {
        return (
            <div className={styles.pageLayout}>
                <DashboardTopbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Pesquise por algum alimento"
                />
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
                <DashboardTopbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Pesquise por algum alimento"
                />
                <main className={styles.mainContent}>
                    <p className={styles.errorText}>{error}</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.pageLayout}>
            <DashboardTopbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Pesquise por algum alimento"
            />

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
                    <h1 className={styles.farmName}>Produtor: {producer?.name || "Fazenda"}</h1>
                    <div className={styles.farmInfo}>
                        {producer?.city && (
                            <span className={styles.farmLocation}>📍 {producer.city}</span>
                        )}
                        {producer?.phone && (
                            <span className={styles.farmContact}>📞 {producer.phone}</span>
                        )}
                        {producer?.address && (
                            <span className={styles.farmAddress}>🏠 {producer.address}</span>
                        )}
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
                    ) : filteredProducts.length === 0 ? (
                        <div className={styles.noProducts}>
                            <p className={styles.noProductsText}>
                                Nenhum produto encontrado com "{searchTerm}".
                            </p>
                        </div>
                    ) : (
                        <div className={styles.productsGrid}>
                            {filteredProducts.map((product) => (
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
                                        <p className={styles.productPrice}>Preço /kg: R$ {formatPrice(parseFloat(product.price))}</p>
                                        <div className={styles.productActions}>
                                            <button
                                                className={styles.decrementBtn}
                                                onClick={() => handleQuantityChange(product.id, -1)}
                                            >
                                                -
                                            </button>
                                            <span className={styles.quantity}>
                                                {productQuantities[product.id] || 1}
                                            </span>
                                            <button
                                                className={styles.incrementBtn}
                                                onClick={() => handleQuantityChange(product.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            className={styles.addToCartBtn}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Adicionar ao Carrinho
                                        </button>
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
