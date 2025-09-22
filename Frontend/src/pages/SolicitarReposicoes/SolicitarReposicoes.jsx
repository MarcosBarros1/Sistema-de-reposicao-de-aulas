import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/NavBar';
import Modal from '../../components/Modal/Modal';
import ReposicaoForm from '../../components/ReposicaoForm/ReposicaoForm';
import { useAuth } from '../../context/AuthContext';
import { buscar_turmas, solicitar_reposicao } from '../../services/api';
import './SolicitarReposicoes.css';

const SolicitarReposicaoPage = () => {
  const { usuario } = useAuth();
  const [turmas, set_turmas] = useState([]);
  const [carregando, set_carregando] = useState(true);

  // Estados para o modal
  const [modal_aberto, set_modal_aberto] = useState(false);
  const [turma_selecionada, set_turma_selecionada] = useState(null);

  useEffect(() => {
    const carregar_turmas = async () => {
      try {
        const dados = await buscar_turmas();
        set_turmas(dados || []);
      } catch (err) {
        alert('Falha ao carregar as turmas.');
      } finally {
        set_carregando(false);
      }
    };
    carregar_turmas();
  }, []);

  const handle_abrir_modal = (turma) => {
    set_turma_selecionada(turma);
    set_modal_aberto(true);
  };

  const handle_fechar_modal = () => {
    set_modal_aberto(false);
    set_turma_selecionada(null);
  };

  const handle_submit_reposicao = async (dados_form) => {
    try {
      // Combina os dados do formulário com os dados necessários da turma e do professor
      const payload = {
        ...dados_form,
        idTurma: turma_selecionada.id_turma,
        idProfessor: usuario.matriculaProfessor
      };

      await solicitar_reposicao(payload);
      alert('Solicitação de reposição enviada com sucesso! Os alunos serão notificados.');
      handle_fechar_modal();
    } catch (error) {
      alert(`Falha ao enviar solicitação: ${error.message}`);
    }
  };

  if (carregando) return <div>Carregando...</div>;

  return (
    <div className="page-container">
      <Navbar 
        userName={usuario ? usuario.nome.toUpperCase() : ''}
        userIdentifier={usuario ? usuario.matriculaProfessor : ''}
      />
      <div className="content-area">
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Solicitar Reposição de Aula</h1>
            <p>Selecione uma turma para iniciar uma nova solicitação.</p>
          </div>

          <div className="turmas-list">
            {turmas.map(turma => (
              <div key={turma.id_turma} className="turma-card">
                <div className="turma-info">
                  <h3>{turma.nome}</h3>
                  <p>{turma.semestre} | {turma.alunos.length} aluno(s)</p>
                </div>
                <button 
                  className="solicitar-btn" 
                  onClick={() => handle_abrir_modal(turma)}
                >
                  Solicitar Reposição
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        is_open={modal_aberto}
        on_close={handle_fechar_modal}
        title={`Nova Reposição para: ${turma_selecionada?.nome}`}
      >
        <ReposicaoForm 
          on_submit={handle_submit_reposicao}
          on_cancel={handle_fechar_modal}
        />
      </Modal>
    </div>
  );
};

export default SolicitarReposicaoPage;