import logoImg from '../assets/logos/Logo.svg'; // 1. Importa a imagem da logo
import styles from './TopBar.module.css';
import { Link } from 'react-router-dom';

export function TopBar() {
  return (
    <div className={styles.topbarContainer}>
      <img src={logoImg} alt="Healthy Food Logo" className={styles.logo} />

      <div className={styles.navigation}>
        <Link to="/login-produtor" className={styles.button}>
          Sou Produtor
        </Link>
        <Link to="/login" className={styles.button}>
          Sou Cliente
        </Link>
      </div>
    </div>
  );
}