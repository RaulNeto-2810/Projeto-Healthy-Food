// frontend/src/pages/ClientDashboardPage.tsx

import { useState, useEffect } from "react";
import apiClient from "@/lib/axiosConfig";
import { DashboardTopbar } from "@/components/DashboardTopbar";
import { FilterBar } from "@/components/FilterBar";
import { ProducerCard } from "@/components/ProducerCard"; // Importa o novo card
import { Footer } from "@/components/Footer";
import styles from "../styles/modules/ClientDashboardPage.module.css";

// Define a interface para os dados do produtor que virão da API
interface ProducerProfileData {
    id: number;
    name: string;
}

export function ClientDashboardPage() {
    // Estados para a lista de produtores, carregamento e erro
    const [producers, setProducers] = useState<ProducerProfileData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Log para debug
    useEffect(() => {
        console.log('Estado atual:', { producers, loading, error });
    }, [producers, loading, error]);

    // useEffect para buscar os produtores da API
    useEffect(() => {
        const fetchProducers = async () => {
            console.log('Iniciando busca de produtores...');
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('/api/producers/');
                console.log('API Response:', response.data);
                console.log('Response status:', response.status);
                console.log('Is array?', Array.isArray(response.data));

                // Verifica se a resposta é um array
                if (Array.isArray(response.data)) {
                    console.log('Setando produtores:', response.data);
                    setProducers(response.data);
                } else if (response.data && Array.isArray(response.data.results)) {
                    // Caso a API retorne um objeto com chave 'results'
                    console.log('Setando produtores (results):', response.data.results);
                    setProducers(response.data.results);
                } else {
                    console.error("API response is not an array:", response.data);
                    setError("Formato de dados inesperado recebido do servidor.");
                    setProducers([]);
                }
            } catch (err) {
                // Só mostra erro se não for erro de autenticação
                const error = err as { response?: { status?: number } };
                console.error("Erro capturado:", err);
                console.error("Status do erro:", error.response?.status);
                if (error.response?.status !== 401) {
                    setError("Não foi possível carregar os parceiros.");
                    console.error("Erro ao buscar produtores:", err);
                }
                setProducers([]);
            } finally {
                console.log('Finalizando busca. Loading = false');
                setLoading(false);
            }
        };

        fetchProducers();
    }, []);

    return (
        <div className={styles.dashboardLayout}>
            <DashboardTopbar />

            <main className={styles.mainContent}>
                <FilterBar />

                {/* Seção da Grade de Produtores */}
                <div className={styles.producerGrid}>
                    {loading && <p className="col-span-full text-center">Carregando parceiros...</p>}
                    {error && <p className="col-span-full text-center text-red-500">{error}</p>}
                    {!loading && !error && producers.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">Nenhum parceiro encontrado.</p>
                    )}
                    {!loading && !error && producers.map((producer) => (
                        <ProducerCard key={producer.id} producer={producer} />
                    ))}
                </div>

                {/* Botão "Ver mais" (opcional) */}
                {/* <div className={styles.viewMoreContainer}>
                    <button className={styles.viewMoreButton}>Ver mais</button>
                </div> */}

            </main>

            <Footer />
        </div>
    );
}