// frontend/src/lib/axiosConfig.ts

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Cria uma instância do axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Token refresh queue logic removed because refresh flow is not implemented yet.

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

// Lista de URLs públicas que não requerem autenticação
const publicUrls = [
    '/api/producers/',
    '/api/producers',
    '/auth/login',
    '/auth/registration'
];

// Verifica se a URL é pública
const isPublicUrl = (url: string) => {
    return publicUrls.some(publicUrl => url.includes(publicUrl));
};

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
            const requestUrl = error.config?.url || '';

            // Não redireciona se for uma URL pública
            if (!isPublicUrl(requestUrl)) {
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
