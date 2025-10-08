// frontend/src/main.tsx
import '../src/globals.css'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { ProducerLoginPage } from './pages/ProducerLoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ProducerRegisterPage } from './pages/ProducerRegisterPage.tsx';

import './index.css';

// Aqui definimos todas as rotas da nossa aplicação
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // O App é o elemento pai (layout)
    children: [
      // As rotas filhas são renderizadas dentro do <Outlet /> do App
      {
        index: true, // <-- MUDANÇA AQUI: de 'path: "/"' para 'index: true'
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/login-produtor',
        element: <ProducerLoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/register-produtor',
        element: <ProducerRegisterPage />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);