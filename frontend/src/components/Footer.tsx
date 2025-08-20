// frontend/src/components/Footer.tsx

import styles from './Footer.module.css';

// Importando os ícones
import facebookIcon from '../assets/icons/Facebook.svg';
import instagramIcon from '../assets/icons/Instagram.svg';
import threadsIcon from '../assets/icons/Threads.svg';
import xIcon from '../assets/icons/X.svg';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerWrapper}>

                {/* Fileira de cima com os links principais e ações */}
                <div className={styles.topRow}>
                    <div className={styles.linkGroup}>
                        <div className={styles.linkColumn}>
                            <h3>Sobre nós</h3>
                            <a href="#">Quem somos</a>
                            <a href="#">Suporte</a>
                        </div>
                        <div className={styles.linkColumn}>
                            <h3>Parcerias</h3>
                            <a href="#">Torne-se parceiro</a>
                        </div>
                    </div>

                    <div className={styles.actionGroup}>
                        <div className={styles.socialColumn}>
                            <h3>Social</h3>
                            <div className={styles.socialIcons}>
                                <a href="#"><img src={facebookIcon} alt="Facebook" /></a>
                                <a href="#"><img src={instagramIcon} alt="Instagram" /></a>
                                <a href="#"><img src={threadsIcon} alt="Threads" /></a>
                                <a href="#"><img src={xIcon} alt="X" /></a>
                            </div>
                        </div>
                        <div className={styles.ctaColumn}>
                            <button className={styles.ctaButton}>Criar Conta</button>
                        </div>
                    </div>
                </div>

                {/* Fileira do meio com os links legais */}
                <div className={styles.legalLinks}>
                    <a href="#">Termo de uso</a>
                    <a href="#">Política de privacidade</a>
                </div>

                {/* Fileira de baixo com o copyright */}
                <div className={styles.copyrightContent}>
                    <p>© Copyright {currentYear} - Healthy Food Tecnologia em Alimentos LTDA - CNPJ: 99.999.999/0001-99</p>
                    <p>Rua Girassol, 001, - CEP: 38307-001</p>
                    <p>Cidade Jardim - Ituiutaba/MG</p>
                </div>

            </div>
        </footer>
    );
}