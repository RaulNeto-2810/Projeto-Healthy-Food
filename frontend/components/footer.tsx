// frontend/src/components/Footer.tsx
import styles from "../src/styles/modules/footer.module.css";

export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className={styles.footer}>
            <p>© {currentYear} Healthy Food. Todos os direitos reservados.</p>
        </footer>
    );
}
