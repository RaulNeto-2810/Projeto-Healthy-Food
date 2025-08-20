import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { ProductCarousel } from './components/ProductCarousel';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  return (
    <div>
      {/* Este <main> agora centraliza o conteúdo principal */}
      <main className="mainContent">
        <TopBar />
        <Hero />
        <ProductCarousel />
        <AboutSection />
      </main>
      
      {/* O Footer fica FORA do main para poder ocupar a largura total */}
      <Footer />
    </div>
  );
}

export default App;