// frontend/src/components/DashboardTopbar.tsx

import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { searchOutline, cartOutline, logOutOutline, receiptOutline } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ClientOrdersModal } from './ClientOrdersModal';

import logoImg from '@/assets/logos/logo-light.svg';
import styles from './DashboardTopbar.module.css';
import axios from 'axios';

interface DashboardTopbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
}

export function DashboardTopbar({ searchTerm = '', onSearchChange, searchPlaceholder = 'Pesquise por algum produtor' }: DashboardTopbarProps) {
    const navigate = useNavigate();
    const { openCart, items } = useCart();
    const [showOrdersModal, setShowOrdersModal] = useState(false);

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
                        placeholder={searchPlaceholder}
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                    <div className={styles.searchIcon}>
                        <IonIcon icon={searchOutline} />
                    </div>
                </div>
            </div>

            <div className={styles.iconGroup}>
                <button className={styles.iconButton} onClick={() => setShowOrdersModal(true)}>
                    <IonIcon icon={receiptOutline} />
                </button>

                <button className={styles.iconButton} onClick={openCart}>
                    <IonIcon icon={cartOutline} />
                    {items.length > 0 && (
                        <span className={styles.cartBadge}>{items.length}</span>
                    )}
                </button>

                <button onClick={handleLogout} className={styles.iconButton}>
                    <IonIcon icon={logOutOutline} />
                </button>
            </div>

            <ClientOrdersModal
                isOpen={showOrdersModal}
                onClose={() => setShowOrdersModal(false)}
            />
        </header>
    );
}