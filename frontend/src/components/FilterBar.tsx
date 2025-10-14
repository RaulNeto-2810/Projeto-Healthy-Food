// frontend/src/components/FilterBar.tsx

import { IonIcon } from '@ionic/react';
import { chevronDownOutline, filterOutline } from 'ionicons/icons';
import styles from './FilterBar.module.css';

export function FilterBar() {
    return (
        <section className={styles.filterSection}>
            <h2 className={styles.title}>Nossos Parceiros:</h2>
            <div className={styles.controlsContainer}>
                <button className={styles.filterButton}>
                    <span>Filtros</span>
                    <IonIcon icon={chevronDownOutline} />
                </button>
                <button className={styles.filterButton}>
                    <span>Ordenar</span>
                    <IonIcon icon={filterOutline} />
                </button>
            </div>
        </section>
    );
}