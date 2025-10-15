// frontend/src/pages/ReportsPage.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import styles from '../styles/modules/ProducerDashboardPage.module.css';

export function ReportsPage() {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Header title="Relatórios" />
                <main className={styles.mainContent}>
                </main>
            </div>
        </div>
    );
}