import React from 'react';
import Navbar from '../../components/Navbar/NavBar';
import './GerenciarTurmas.css';
import { FaSearch } from 'react-icons/fa'; // Ícone para a barra de busca
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { buscar_turmas, remover_turma } from '../../services/api';


const GerenciarTurmas = () => {
  const { usuario } = useAuth();

  // Estados para turmas, carregamento e erros
  const [turmas, set_turmas] = useState([]);
  const [carregando, set_carregando] = useState(true);
  const [erro, set_erro] = useState('');

  useEffect(() => {
    const carregar_turmas = async () => {
      try {
        const dados = await buscar_turmas();
        set_turmas(dados);
      } catch (err) {
        set_erro('Falha ao carregar as turmas.');
      } finally {
        set_carregando(false);
      }
    };
    carregar_turmas();
  }, []);

  if (carregando) {
    return <div>Carregando turmas...</div>;
  }

  if (erro) {
    return <div>{erro}</div>;
  }

  const handle_remover_turma = async (id_turma) => {
    // Pede confirmação ao usuário
    if (window.confirm('Tem certeza que deseja excluir esta turma? Esta ação é irreversível.')) {
      try {
        await remover_turma(id_turma);
        // Atualiza a lista de turmas no frontend, removendo a que foi excluída
        set_turmas(turmas_atuais => turmas_atuais.filter(t => t.id_turma !== id_turma));
      } catch (err) {
        alert('Falha ao remover a turma.');
      }
    }
  };

  return (
    <div className="page-container">
      <Navbar
        userName={usuario ? usuario.nome.toUpperCase() : 'Carregando...'}
        userIdentifier={usuario ? usuario.matriculaCoordenador : ''}
        userAvatarUrl={usuario ? usuario.avatar : ""}
      />

      <div className="content-area">
        {/* 👇 ADICIONAMOS ESTE WRAPPER PARA CENTRALIZAR O CONTEÚDO 👇 */}
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Gerenciar Turmas</h1>
            <button className="add-button">+ Adicionar Turmas</button>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Buscar por nome ou disciplina..." />
            <FaSearch className="search-icon" />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Semestre</th>
                  <th>Qtd de alunos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma) => (
                  <tr key={turma.id_turma}>
                    <td>{turma.nome}</td>
                    <td>{turma.semestre}</td>
                    <td>{turma.alunos.length}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">Editar</button>
                        <button className="remove-btn" onClick={() => handle_remover_turma(turma.id_turma)}>
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> {/* Fim do content-wrapper */}
      </div>
    </div>
  );
};

export default GerenciarTurmas;