import { TopBar } from '../components/TopBar';
import { Hero } from '../components/Hero';
import { ProductCarousel } from '../components/ProductCarousel';
import { AboutSection } from '../components/AboutSection';
import { Footer } from '../components/Footer';

export function HomePage() {
    return (
        <>
            <TopBar />
            <Hero />
            <ProductCarousel />
            <AboutSection />
            <Footer />
        </>
    );
}