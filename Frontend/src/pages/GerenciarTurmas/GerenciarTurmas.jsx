import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './GerenciarTurmas.css';
import { FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { buscar_turmas, remover_turma, criar_turma, atualizar_turma } from '../../services/api';
import Modal from '../../components/Modal/Modal';
import TurmaForm from '../../components/TurmaForm/TurmaForm';


const GerenciarTurmas = () => {
  const { usuario } = useAuth();

  // Estados para turmas, carregamento e erros
  const [turmas, set_turmas] = useState([]);
  const [carregando, set_carregando] = useState(true);
  const [erro, set_erro] = useState('');

  // Estados para controlar o modal
  const [modal_aberto, set_modal_aberto] = useState(false);
  const [turma_selecionada, set_turma_selecionada] = useState(null);

  // Estado para controlar o carregamento do formulário
  const [is_submitting, set_is_submitting] = useState(false);

  useEffect(() => {
    const carregar_turmas = async () => {
      try {
        const dados = await buscar_turmas();
        set_turmas(dados || []);
      } catch (err) {
        set_erro('Falha ao carregar as turmas.');
        set_turmas([]);
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

  const handle_abrir_modal_adicionar = () => {
    set_turma_selecionada(null);
    set_modal_aberto(true);
  };

  const handle_abrir_modal_editar = (turma) => {
    set_turma_selecionada(turma);
    set_modal_aberto(true);
  };

  const handle_fechar_modal = () => {
    set_modal_aberto(false);
    set_turma_selecionada(null);
  };

  // ATUALIZADO: Função de submit agora controla o estado 'is_submitting'
  const handle_submit_form = async (dados_form) => {
    set_is_submitting(true); // Liga o "carregando"
    try {
      if (turma_selecionada) {
        const turma_atualizada = await atualizar_turma(turma_selecionada.id_turma, dados_form);
        set_turmas(turmas.map(t => t.id_turma === turma_atualizada.id_turma ? turma_atualizada : t));
      } else {
        const nova_turma = await criar_turma(dados_form);
        set_turmas([...turmas, nova_turma]);
      }
      handle_fechar_modal();
    } catch (error) {
      alert('Falha ao salvar a turma.');
    } finally {
      set_is_submitting(false); // Desliga o "carregando" no final
    }
  };

  const handle_remover_turma = async (id_turma) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma? Esta ação é irreversível.')) {
      try {
        await remover_turma(id_turma);
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
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Gerenciar Turmas</h1>
            <button className="add-button" onClick={handle_abrir_modal_adicionar}>
              + Adicionar Turmas
            </button>
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
                    <td>{turma.alunos ? turma.alunos.length : 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handle_abrir_modal_editar(turma)}>
                          Editar
                        </button>
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
        </div>
      </div>
      
      <Modal
        is_open={modal_aberto}
        on_close={handle_fechar_modal}
        title={turma_selecionada ? 'Editar Turma' : 'Adicionar Nova Turma'}
      >
        <TurmaForm
          on_submit={handle_submit_form}
          on_cancel={handle_fechar_modal}
          turma_para_editar={turma_selecionada}
          // Passando a prop de carregamento para o formulário
          is_loading={is_submitting}
        />
      </Modal>
    </div>
  );
};

export default GerenciarTurmas;