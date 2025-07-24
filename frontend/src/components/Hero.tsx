import styles from './Hero.module.css';
import heroImage from '../assets/mulher-cesta.jpg';

export function Hero() {
    return (
        <section className={styles.heroContainer}>
            <div className={styles.imageContainer}>
                {<img src={heroImage} alt="Produtora local com alimentos frescos" />}
            </div>

            <div className={styles.textContainer}>
                <h1 className={styles.title}>
                    Quer se alimentar de forma saudável?
                </h1>
                <p className={styles.paragraph}>
                    Na Healthy Food, comer bem é mais do que uma escolha — é um estilo de vida fácil, gostoso e cheio de propósito! Aqui você encontra alimentos fresquinhos direto dos pequenos produtores da sua região, com praticidade e carinho em cada detalhe.
                </p>
                <button className={styles.ctaButton}>
                    Crie sua conta!
                </button>
            </div>
        </section>
    );
}