// frontend/src/components/layout/Sidebar.tsx

import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Package, Store } from "lucide-react";
import logoImg from "@/assets/logos/logo-dark.svg";
import styles from './Sidebar.module.css';

// Dados dos links de navegação
const navLinks = [
    { href: "/dashboard-produtor", label: "Dashboard", icon: Home },
    { href: "/dashboard-produtor/produtos", label: "Meus Produtos", icon: Package },
    { href: "/dashboard-produtor/pedidos", label: "Pedidos", icon: ShoppingCart },
    { href: "/dashboard-produtor/perfil", label: "Perfil da Loja", icon: Store },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className={styles.sidebarContainer}>
            <div className={styles.sidebarContent}>
                <div className={styles.sidebarHeader}>
                    <Link to="/">
                        <img src={logoImg} alt="Healthy Food" className={styles.logo} />
                    </Link>
                </div>
                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.href}
                            // Aplica a classe 'activeLink' se a URL atual corresponder ao link
                            className={`${styles.navLink} ${location.pathname === link.href ? styles.activeLink : ''}`}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}