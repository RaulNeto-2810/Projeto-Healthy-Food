// frontend/src/App.tsx
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import './App.css';

function App() {
  return (
    <div className="pageContainer">
      <Header />
      <main className="mainContent">
        {/* O Outlet renderizará a página da rota atual (Home, Receitas, etc.) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;