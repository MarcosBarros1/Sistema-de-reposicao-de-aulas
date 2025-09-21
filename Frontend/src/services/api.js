// src/services/api.js
import axios from 'axios';

// Cria uma instância do axios pré-configurada
const api = axios.create({
  // URL base da nossa API que está no Render
  baseURL: 'http://localhost:3000'
});

// "Interceptor" de Requisições: uma função que é executada ANTES de cada requisição sair
api.interceptors.request.use(
  (config) => {
    // Pega o token de autenticação que salvamos no navegador (vamos implementar isso a seguir)
    const token = localStorage.getItem('authToken');

    // Se o token existir, adiciona ele ao cabeçalho de todas as requisições
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição
    return Promise.reject(error);
  }
);


// Função para fazer login
export const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', { email, senha });
    return response.data; // Retorna os dados { token, usuario }
  } catch (error) {
    // Lança o erro para que o componente que chamou possa tratá-lo
    throw error.response.data;
  }
};

// Função para cadastrar um professor
export const cadastrarProfessor = async (dadosProfessor) => {
  try {
    const response = await api.post('/professor/cadastrar', dadosProfessor);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Função para buscar todas as turmas
export const buscar_turmas = async () => {
  try {
    const response = await api.get('/turmas'); // Chama o endpoint GET /turmas
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const remover_turma = async (id_turma) => {
  try {
    await api.delete(`/turmas/${id_turma}`);
  } catch (error) {
    throw error.response.data;
  }
};

export default api;