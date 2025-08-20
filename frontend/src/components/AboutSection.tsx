// frontend/src/components/AboutSection.tsx

import styles from './AboutSection.module.css';
import plantImage from '../assets/imagens/foto-planta.png'; // Importa a imagem da planta

export function AboutSection() {
    return (
        <section className={styles.aboutContainer}>
            <div className={styles.textWrapper}>
                <h2 className={styles.title}>A gente da Healthy:</h2>
                <p className={styles.paragraph}>
                    Somos apaixonados por criar conexões que fazem bem: ligamos você aos pequenos produtores da sua região pra facilitar o acesso a alimentos frescos, saudáveis e cheios de sabor. Nossa missão é tornar o ato de se alimentar melhor algo leve, acessível e acolhedor com carinho no atendimento, respeito ao seu tempo e muito amor pelo que fazemos!
                </p>
            </div>
            <div className={styles.imageWrapper}>
                <img src={plantImage} alt="Muda de planta crescendo na terra" />
            </div>
        </section>
    );
}