import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/NavBar';
import './GerenciarProfessores.css';
import { useAuth } from '../../context/AuthContext';
import { buscar_professores, notificar_falta_professor } from '../../services/api';

function GerenciarProfessores() {
  const { usuario } = useAuth();
  const [professores, set_professores] = useState([]);
  const [filtro, set_filtro] = useState('');
  const [carregando, set_carregando] = useState(true);

  // Busca os dados da API quando o componente é carregado
  useEffect(() => {
    const carregar_professores = async () => {
      try {
        const dados = await buscar_professores();
        set_professores(dados || []);
      } catch (error) {
        console.error("Falha ao carregar professores:", error);
        alert("Não foi possível carregar a lista de professores.");
      } finally {
        set_carregando(false);
      }
    };
    carregar_professores();
  }, []);

  // Filtra os professores com base na busca
  const professores_filtrados = professores.filter(prof =>
    prof.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    (prof.disciplinas && prof.disciplinas.join(', ').toLowerCase().includes(filtro.toLowerCase()))
  );

  // Função para lidar com a notificação de falta
  const handle_notificar_falta = async (matricula) => {
    if (window.confirm(`Tem certeza que deseja notificar a falta do professor de matrícula ${matricula}?`)) {
      try {
        const response = await notificar_falta_professor(matricula);
        alert(response.message); // Exibe a mensagem de sucesso da API
      } catch (error) {
        alert(`Falha ao notificar falta: ${error.message}`);
      }
    }
  };

  if (carregando) return <div>Carregando...</div>;

  return (
    <div className="page-container">
      <Navbar
        userName={usuario ? usuario.nome.toUpperCase() : ''}
        userIdentifier={usuario ? usuario.matriculaCoordenador : ''}
        userAvatarUrl={usuario ? usuario.avatar : ""}
      />
      <div className="content-area">
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Gerenciar Professores</h1>
            <button className="add-button">+ Adicionar Professor</button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nome ou disciplina..."
              value={filtro}
              onChange={(e) => set_filtro(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Disciplinas</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {professores_filtrados.map((professor) => (
                  <tr key={professor.matriculaProfessor}>
                    <td>{professor.nome}</td>
                    {/* Transforma o array de disciplinas em uma string separada por vírgula */}
                    <td>{professor.disciplinasMinistradas.join(', ')}</td>
                    <td>{professor.email}</td>
                    <td className="actions-cell">
                      <button className="action-button notify-button" onClick={() => handle_notificar_falta(professor.matriculaProfessor)}>
                        Notificar Falta
                      </button>
                      <button className="action-button edit-button">Editar</button>
                      <button className="action-button delete-button">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GerenciarProfessores;