// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import { Home } from '../pages/Home.tsx';
import { Receitas } from '../pages/Receitas.tsx';
import { Sobre } from '../pages/Sobre.tsx';
import { Contato } from '../pages/Contato.tsx';

import './index.css';

// Configuração do roteador
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // O App agora é o layout principal
    children: [
      // As rotas filhas serão renderizadas dentro do <Outlet /> do App
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/receitas',
        element: <Receitas />,
      },
      {
        path: '/sobre',
        element: <Sobre />,
      },
      {
        path: '/contato',
        element: <Contato />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);