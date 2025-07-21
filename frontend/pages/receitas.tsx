// frontend/src/pages/Receitas.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../src/styles/modules/receitas.module.css';

// Definimos o formato de uma receita para o TypeScript
interface Recipe {
    id: number;
    title: string;
    description: string;
    image_url: string;
}

export function Receitas() {
    // Estados para guardar os dados, o status de carregamento e erros
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Função para buscar os dados da API
        const fetchRecipes = async () => {
            try {
                setIsLoading(true); // Começa a carregar
                // Usamos o proxy do Vite para chamar a API do Django
                const response = await axios.get('/api/recipes/');
                setRecipes(response.data); // Guarda os dados no estado
                setError(null); // Limpa erros anteriores
            } catch (err) {
                setError('Não foi possível carregar as receitas.');
                console.error(err);
            } finally {
                setIsLoading(false); // Termina de carregar
            }
        };

        fetchRecipes();
    }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez

    // Renderiza uma mensagem de carregamento
    if (isLoading) {
        return <div className={styles.loading}>Carregando receitas...</div>;
    }

    // Renderiza uma mensagem de erro
    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    // Renderiza a lista de receitas
    return (
        <div>
            <h2>Nossas Receitas Saudáveis</h2>
            <div className={styles.recipeGrid}>
                {recipes.map((recipe) => (
                    <div key={recipe.id} className={styles.card}>
                        <img src={recipe.image_url} alt={recipe.title} className={styles.cardImage} />
                        <div className={styles.cardContent}>
                            <h3>{recipe.title}</h3>
                            <p>{recipe.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
