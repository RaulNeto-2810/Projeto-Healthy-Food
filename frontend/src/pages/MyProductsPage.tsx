// frontend/src/pages/MyProductsPage.tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header"; // A importação continua a mesma
import styles from '../styles/modules/ProducerDashboardPage.module.css';

export function MyProductsPage() {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                {/* Passamos o título desejado aqui */}
                <Header title="Meus Produtos" />
                <main className={styles.mainContent}>
                </main>
            </div>
        </div>
    );
}