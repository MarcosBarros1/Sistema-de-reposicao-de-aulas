import React, { useState } from 'react';
import './ConfirmEmailModal.css';

const ConfirmEmailModal = ({ isOpen, onClose, onConfirm }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (email && email.includes('@')) {
      onConfirm(email);
    } else {
      alert('Por favor, insira um e-mail válido.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirmar Realização e Notificar Coordenador</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Para notificar o coordenador, por favor, insira o e-mail dele abaixo.</p>
          <div className="form-group">
            <label htmlFor="coordenador-email">E-mail do Coordenador</label>
            <input
              type="email"
              id="coordenador-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@ifce.edu.br"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="confirm-button" onClick={handleConfirm}>Confirmar e Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailModal;