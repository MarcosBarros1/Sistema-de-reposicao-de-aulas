import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import ProfessorForm from '../../components/ProfessorForm/ProfessorForm';
import './GerenciarProfessores.css';
import { useAuth } from '../../context/AuthContext';
import { buscar_professores, notificar_falta_professor, cadastrarProfessor, atualizar_professor, deletar_professor } from '../../services/api';
import { FaSearch } from 'react-icons/fa'; // Importando o ícone de busca

function GerenciarProfessores() {
  const { usuario } = useAuth();
  const [professores, set_professores] = useState([]);
  const [filtro, set_filtro] = useState('');
  const [carregando, set_carregando] = useState(true);

  // Estados para o modal
  const [modal_aberto, set_modal_aberto] = useState(false);
  const [professor_selecionado, set_professor_selecionado] = useState(null);
  
  // ✅ 1. ADICIONADO: Estado para controlar o carregamento do formulário
  const [is_submitting, set_is_submitting] = useState(false);

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

  useEffect(() => {
    carregar_professores();
  }, []);

  const handle_abrir_modal_adicionar = () => {
    set_professor_selecionado(null);
    set_modal_aberto(true);
  };

  const handle_abrir_modal_editar = (professor) => {
    set_professor_selecionado(professor);
    set_modal_aberto(true);
  };

  const handle_fechar_modal = () => {
    set_modal_aberto(false);
    set_professor_selecionado(null);
  };

  // ✅ 2. ATUALIZADO: Função de submit agora controla o estado 'is_submitting'
  const handle_submit_form = async (dados_form) => {
    set_is_submitting(true);
    try {
      if (professor_selecionado) {
        await atualizar_professor(professor_selecionado.matriculaProfessor, dados_form);
      } else {
        await cadastrarProfessor(dados_form);
      }
      handle_fechar_modal();
      carregar_professores();
    } catch (error) {
      alert(`Falha ao salvar o professor: ${error.message || 'Erro desconhecido'}`);
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_deletar_professor = async (matricula) => {
    if (window.confirm(`Tem certeza que deseja excluir o professor de matrícula ${matricula}?`)) {
      try {
        await deletar_professor(matricula);
        carregar_professores();
      } catch (error) {
        alert(`Falha ao excluir o professor: ${error.message}`);
      }
    }
  };
  
  const professores_filtrados = professores.filter(prof =>
    prof.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    (prof.disciplinasMinistradas && prof.disciplinasMinistradas.join(', ').toLowerCase().includes(filtro.toLowerCase()))
  );

  const handle_notificar_falta = async (matricula) => {
    if (window.confirm(`Tem certeza que deseja notificar a falta do professor de matrícula ${matricula}?`)) {
      try {
        const response = await notificar_falta_professor(matricula);
        alert(response.message);
      } catch (error) {
        alert(`Falha ao notificar falta: ${error.message}`);
      }
    }
  };

  if (carregando && !usuario) return <div>Carregando...</div>;

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
            <button className="add-button" onClick={handle_abrir_modal_adicionar}>
              + Adicionar Professor
            </button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nome ou disciplina..."
              value={filtro}
              onChange={(e) => set_filtro(e.target.value)}
            />
            <FaSearch className="search-icon"/>
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
                    <td>{professor.disciplinasMinistradas.join(', ')}</td>
                    <td>{professor.email}</td>
                    <td className="actions-cell">
                      <button className="action-button notify-button" onClick={() => handle_notificar_falta(professor.matriculaProfessor)}>
                        Notificar Falta
                      </button>
                      <button className="action-button edit-button" onClick={() => handle_abrir_modal_editar(professor)}>
                        Editar
                      </button>
                      <button className="action-button delete-button" onClick={() => handle_deletar_professor(professor.matriculaProfessor)}>
                        Excluir
                      </button>
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
        title={professor_selecionado ? 'Editar Professor' : 'Adicionar Novo Professor'}
      >
        <ProfessorForm
          on_submit={handle_submit_form}
          on_cancel={handle_fechar_modal}
          professor_para_editar={professor_selecionado}
          // ✅ 3. ADICIONADO: Passando a prop de carregamento para o formulário
          is_loading={is_submitting}
        />
      </Modal>
    </div>
  );
}

export default GerenciarProfessores;