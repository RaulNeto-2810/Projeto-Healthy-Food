// frontend/src/components/DashboardTopbar.tsx

import { IonIcon } from '@ionic/react';
// REMOVIDO: 'locationOutline' não é mais necessário aqui
import { searchOutline, cartOutline, logOutOutline } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';

import logoImg from '@/assets/logos/Logo.svg';
import styles from './DashboardTopbar.module.css';
import axios from 'axios';

export function DashboardTopbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    return (
        <header className={styles.topbarContainer}>
            
            <Link to="/dashboard-cliente">
                <img src={logoImg} alt="Healthy Food Logo" className={styles.logo} /> 
            </Link>

            <div className={styles.searchWrapper}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Pesquise por algum alimento"
                        className={styles.searchInput}
                    />
                    <div className={styles.searchIcon}>
                        <IonIcon icon={searchOutline} />
                    </div>
                </div>
            </div>

            <div className={styles.iconGroup}>
                {/* REMOVIDO: O botão de localização foi apagado daqui */}

                <button className={styles.iconButton}>
                    <IonIcon icon={cartOutline} />
                    {/* REMOVIDO: O <span> com a classe 'cartBadge' foi apagado daqui */}
                </button>

                <button onClick={handleLogout} className={styles.iconButton}>
                    <IonIcon icon={logOutOutline} />
                </button>
            </div>
        </header>
    );
}