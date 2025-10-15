// frontend/src/components/layout/Header.tsx

import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { IonIcon } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import styles from './Header.module.css';

// 1. A interface agora inclui a prop 'actions', que pode ser qualquer elemento React (JSX)
interface HeaderProps {
    title: string;
    actions?: React.ReactNode; // Prop opcional para os botões de ação
}

export function Header({ title, actions }: HeaderProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login-produtor');
    };

    return (
        <header className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>{title}</h1>

            {/* 2. Div para agrupar as ações da direita */}
            <div className={styles.actionsWrapper}>
                {/* O 'actions' (nosso botão) será renderizado aqui, se for passado pela página */}
                {actions}

                {/* Botão de logout com ícone */}
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <IonIcon icon={logOutOutline} />
                </button>
            </div>
        </header>
    );
}