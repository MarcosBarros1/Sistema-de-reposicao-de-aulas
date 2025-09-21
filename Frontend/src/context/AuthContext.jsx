// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../services/api'; // Importa nossa função de login da API

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Efeito para carregar dados do usuário se um token existir
  useEffect(() => {
    // Aqui você poderia adicionar uma lógica para buscar os dados do usuário
    // usando o token, se necessário.
  }, [token]);

  const login = async (email, senha) => {
    try {
      const data = await apiLogin(email, senha);
      setUsuario(data.usuario);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      return data.usuario; // Retorna o usuário em caso de sucesso
    } catch (error) {
      // Limpa o estado em caso de falha no login
      logout();
      throw error; // Repassa o erro para o componente
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ usuario, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Cria um hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};