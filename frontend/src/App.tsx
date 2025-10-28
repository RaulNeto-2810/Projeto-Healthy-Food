// frontend/src/App.tsx

import { Outlet } from 'react-router-dom';
import { CartSidebar } from './components/CartSidebar';
import './App.css';

function App() {
  return (
    <div className="appContainer">
      {/* O Outlet é um placeholder onde o React Router renderizará a página da rota atual */}
      <Outlet />
      {/* Carrinho lateral global */}
      <CartSidebar />
    </div>
  );
}

export default App;