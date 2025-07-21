// frontend/src/components/Header.tsx
import { Link } from 'react-router-dom'; // Importe o Link
import styles from '../src/styles/modules/header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>Healthy Food</div>
            <nav>
                {/* Troque as tags <a> por <Link> e href por to */}
                <Link to="/">Início</Link>
                <Link to="/receitas">Receitas</Link>
                <Link to="/sobre">Sobre</Link>
                <Link to="/contato">Contato</Link>
            </nav>
        </header>
    );
}
