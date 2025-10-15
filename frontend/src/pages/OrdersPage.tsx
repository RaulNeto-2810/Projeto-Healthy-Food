// frontend/src/pages/OrdersPage.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import styles from '../styles/modules/ProducerDashboardPage.module.css';

export function OrdersPage() {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                <Header title="Pedidos" />
                <main className={styles.mainContent}>
                </main>
            </div>
        </div>
    );
}