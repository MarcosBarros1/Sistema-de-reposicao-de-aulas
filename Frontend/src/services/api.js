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

export const cadastrarCoordenador = async (dadosCoordenador) => {
  try {
    // O endpoint provavelmente será diferente, ex: '/coordenador/cadastrar'
    const response = await api.post('/coordenador/cadastrar', dadosCoordenador);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const cadastrar_aluno = async (dadosAluno) => {
  try {
    // Chama o endpoint POST /aluno que descobrimos
    const response = await api.post('/aluno', dadosAluno);
    return response.data;
  } catch (error) {
    // Lança o erro para que o componente possa capturá-lo
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

export const criar_turma = async (dados_turma) => {
  try {
    const response = await api.post('/turmas', dados_turma);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const atualizar_turma = async (id_turma, dados_turma) => {
  try {
    const response = await api.put(`/turmas/${id_turma}`, dados_turma);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const buscar_professores = async () => {
  try {
    const response = await api.get('/professor');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const notificar_falta_professor = async (matricula) => {
  try {
    const response = await api.post(`/coordenador/professores/${matricula}/notificar-falta`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const buscarAssinaturasPorReposicao = async (id_reposicao) => {
  try {
    const response = await api.get(`/reposicao/${id_reposicao}/assinaturas`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const solicitar_reposicao = async (dados_reposicao) => {
  try {
    // A rota que criamos no backend para esta ação
    const response = await api.post('/professor/solicitar-reposicao', dados_reposicao);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const buscarDisciplinas = async () => {
  try {
    // Confirme se o endpoint GET /disciplinas existe no seu backend
    const response = await api.get('/disciplinas');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const buscarMinhasReposicoes = async () => {
  try {
    // Usando a rota GET /reposicao (singular) que está no seu app.js
    const response = await api.get('/reposicao');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar reposições: ", error.response);
    throw error.response.data;
  }
};

export const buscar_reposicoes_pendentes = async () => {
  try {
    const response = await api.get('/reposicao/pendentes-aprovacao');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const avaliar_reposicao = async (id_solicitacao, decisao, comentario) => {
  try {
    const response = await api.post(`/coordenador/solicitacoes/${id_solicitacao}/avaliar`, { decisao, comentario });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const atualizar_professor = async (matricula, dados_professor) => {
  try {
    const response = await api.put(`/professor/${matricula}`, dados_professor);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletar_professor = async (matricula) => {
  try {
    await api.delete(`/professor/${matricula}`);
  } catch (error) {
    throw error.response.data;
  }
};

export default api;