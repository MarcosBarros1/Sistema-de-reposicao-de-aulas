import React, { useState } from 'react';
import './ReposicaoForm.css'; // Criaremos este CSS a seguir

const ReposicaoForm = ({ on_submit, on_cancel, is_enviando }) => {
  const [motivo, set_motivo] = useState('');
  const [data, set_data] = useState('');
  const [horario, set_horario] = useState('');
  const [sala, set_sala] = useState('');

  const handle_submit = (evento) => {
    evento.preventDefault();
    if (new Date(data) < new Date()) {
      alert("A data da reposição não pode ser no passado nem no dia de hoje.");
      return;
    }
    on_submit({ motivo, data, horario, sala });
  };

  return (
    <form onSubmit={handle_submit} className="reposicao-form">
      <div className="form-group">
        <label htmlFor="motivo">Motivo</label>
        <input
          id="motivo" type="text" value={motivo}
          onChange={(e) => set_motivo(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="data">Data</label>
        <input
          id="data" type="date" value={data}
          onChange={(e) => set_data(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="horario">Horário</label>
        <input
          id="horario" type="text" placeholder="Ex: 14:00 - 15:30" value={horario}
          onChange={(e) => set_horario(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="sala">Sala</label>
        <input
          id="sala" type="text" placeholder="Ex: Lab 01" value={sala}
          onChange={(e) => set_sala(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={on_cancel} className="btn-cancel">
          Cancelar
        </button>
        <button type="submit" className="btn-submit" disabled={is_enviando}>
          {is_enviando ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </div>
    </form>
  );
};

export default ReposicaoForm;