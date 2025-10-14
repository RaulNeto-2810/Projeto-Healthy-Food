// frontend/src/pages/ClientDashboardPage.tsx

import { DashboardTopbar } from "@/components/DashboardTopbar";
import { Footer } from "@/components/Footer"; 
import { FilterBar } from "@/components/FilterBar";
import styles from "../styles/modules/ClientDashboardPage.module.css"; 

export function ClientDashboardPage() {
    return (
        <div className={styles.dashboardLayout}>
            <DashboardTopbar />

            <main className={styles.mainContent}>
                <FilterBar />
            </main>

            <Footer />

        </div>
    );
}