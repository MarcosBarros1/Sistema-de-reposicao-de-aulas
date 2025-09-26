import React, { useState, useEffect } from 'react';

const ProfessorForm = ({ on_submit, on_cancel, professor_para_editar }) => {
  const [nome, set_nome] = useState('');
  const [email, set_email] = useState('');
  const [matricula, set_matricula] = useState('');
  const [senha, set_senha] = useState('');

  const is_edit_mode = !!professor_para_editar;

  useEffect(() => {
    if (is_edit_mode) {
      set_nome(professor_para_editar.nome);
      set_email(professor_para_editar.email);
      set_matricula(professor_para_editar.matriculaProfessor);
    } else {
      // Limpa o formulário para o modo de adição
      set_nome('');
      set_email('');
      set_matricula('');
      set_senha('');
    }
  }, [professor_para_editar, is_edit_mode]);

  const handle_submit = (evento) => {
    evento.preventDefault();
    const dados_form = is_edit_mode 
      ? { nome, email } 
      : { nome, email, matricula, senha };
    on_submit(dados_form);
  };

  return (
    <form onSubmit={handle_submit} className="turma-form"> {/* Reutilizando CSS do TurmaForm */}
      <div className="form-group">
        <label htmlFor="nome">Nome do Professor</label>
        <input id="nome" type="text" value={nome} onChange={(e) => set_nome(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" value={email} onChange={(e) => set_email(e.target.value)} required />
      </div>
      
      {/* Campos visíveis apenas no modo de Adicionar */}
      {!is_edit_mode && (
        <>
          <div className="form-group">
            <label htmlFor="matricula">Matrícula</label>
            <input id="matricula" type="number" value={matricula} onChange={(e) => set_matricula(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" value={senha} onChange={(e) => set_senha(e.target.value)} required />
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="button" onClick={on_cancel} className="btn-cancel">Cancelar</button>
        <button type="submit" className="btn-submit">Salvar</button>
      </div>
    </form>
  );
};

export default ProfessorForm;