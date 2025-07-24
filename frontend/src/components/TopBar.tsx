import logoImg from '../assets/Logo.svg'; // 1. Importa a imagem da logo
import styles from './TopBar.module.css';

export function TopBar() {
  return (
    <div className={styles.topbarContainer}>
      <img src={logoImg} alt="Healthy Food Logo" className={styles.logo} />

      <div className={styles.navigation}>
        <button className={styles.button}>Sou Produtor</button>
        <button className={styles.button}>Sou Cliente</button>
      </div>
    </div>
  );
}