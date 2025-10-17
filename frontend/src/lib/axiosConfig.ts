// frontend/src/lib/axiosConfig.ts

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Cria uma instância do axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Variável para controlar se já está renovando o token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Interceptor de requisição - adiciona o token automaticamente
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Usa 'Token' para DRF Token Authentication
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de resposta - trata erros 401
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log("Erro interceptado:", {
            status: error.response?.status,
            url: error.config?.url,
            hasToken: !!localStorage.getItem('authToken')
        });

        // Se o erro for 401 (não autenticado)
        if (error.response?.status === 401) {
            // Se NÃO for a URL de login
            if (!error.config?.url?.includes('/auth/login')) {
                console.log("Token inválido/expirado - redirecionando para login");
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');

                // Só redireciona se não estiver já na página de login
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login-produtor';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
