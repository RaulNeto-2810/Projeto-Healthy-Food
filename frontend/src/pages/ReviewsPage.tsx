// frontend/src/pages/ReviewsPage.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import styles from '../styles/modules/ProducerDashboardPage.module.css';

export function ReviewsPage() {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Header title="Avaliações" />
                <main className={styles.mainContent}>
                </main>
            </div>
        </div>
    );
}