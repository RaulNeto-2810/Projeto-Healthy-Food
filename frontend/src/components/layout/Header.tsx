// frontend/src/components/layout/Header.tsx

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { IonIcon } from '@ionic/react'; // 1. Importe o IonIcon
import { logOutOutline } from 'ionicons/icons'; // 2. Importe o ícone de logout
import styles from './Header.module.css';

// Interface para as props do Header
interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login-produtor');
    };

    return (
        <header className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>{title}</h1>

            <button className={styles.addButton}>+ Adicionar Produto</button>

            {/* 3. Substituímos o DropdownMenu por um botão simples */}
            <button onClick={handleLogout} className={styles.logoutButton}>
                <IonIcon icon={logOutOutline} />
            </button>

        </header>
    );
}