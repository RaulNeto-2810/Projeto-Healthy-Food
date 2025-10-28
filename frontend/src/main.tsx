// frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext.tsx';

import './globals.css';
import './index.css';

import App from './App.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ProducerLoginPage } from './pages/ProducerLoginPage.tsx';
import { ProducerRegisterPage } from './pages/ProducerRegisterPage.tsx';
import { ClientDashboardPage } from './pages/ClientDashboardPage.tsx';
import { ProducerDashboardPage } from './pages/ProducerDashboardPage.tsx';
import { FarmProductsPage } from './pages/FarmProductsPage.tsx';

// 1. Importe as novas páginas
import { MyProductsPage } from './pages/MyProductsPage.tsx';
import { OrdersPage } from './pages/OrdersPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { StoreProfilePage } from './pages/StoreProfilePage.tsx';
import { ReviewsPage } from './pages/ReviewsPage.tsx';


// 2. Adicione as novas rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/login-produtor', element: <ProducerLoginPage /> },
      { path: '/register-produtor', element: <ProducerRegisterPage /> },
      { path: '/dashboard-cliente', element: <ClientDashboardPage /> },
      { path: '/fazenda/:producerId', element: <FarmProductsPage /> },

      // Rotas do Dashboard do Produtor
      { path: '/dashboard-produtor', element: <ProducerDashboardPage /> },
      { path: '/dashboard-produtor/produtos', element: <MyProductsPage /> },
      { path: '/dashboard-produtor/pedidos', element: <OrdersPage /> },
      { path: '/dashboard-produtor/relatorios', element: <ReportsPage /> },
      { path: '/dashboard-produtor/perfil', element: <StoreProfilePage /> },
      { path: '/dashboard-produtor/avaliacoes', element: <ReviewsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);