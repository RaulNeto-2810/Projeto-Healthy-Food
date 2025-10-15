// frontend/src/pages/StoreProfilePage.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import styles from '../styles/modules/ProducerDashboardPage.module.css';

export function StoreProfilePage() {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Header title="Perfil da Loja" />
                <main className={styles.mainContent}>
                </main>
            </div>
        </div>
    );
}