import React from 'react';
import './Modal.css';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ is_open, on_close, title, children }) => {
  if (!is_open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={on_close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={on_close} className="close-button">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;