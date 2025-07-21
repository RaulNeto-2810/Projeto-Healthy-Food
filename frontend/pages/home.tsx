// frontend/src/pages/Home.tsx
import styles from '../src/styles/modules/home.module.css';

export function Home() {
    return (
        // O conteúdo principal foi movido de 'main' para um 'div'
        <div className={styles.homeContent}>
            <h1>Sua Jornada Para uma Vida Saudável Começa Aqui.</h1>
            <p>
                Descubra receitas deliciosas, dicas de nutrição e tudo que você precisa
                para manter um estilo de vida equilibrado e saboroso.
            </p>
            <button className={styles.ctaButton}>Ver Receitas</button>
        </div>
    );
}
