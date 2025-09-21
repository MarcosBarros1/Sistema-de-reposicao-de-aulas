import React, { useState, useEffect } from 'react';
import './MultiSelectModal.css';

const MultiSelectModal = ({ isOpen, onClose, onConfirm, options, selectedValues, title }) => {
  // Estado temporário para as seleções dentro do modal
  const [tempSelections, setTempSelections] = useState(selectedValues);

  // Sincroniza o estado temporário com o estado real quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setTempSelections(selectedValues);
    }
  }, [isOpen, selectedValues]);

  // Função para lidar com o clique na checkbox
  const handleCheckboxChange = (value) => {
    setTempSelections(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) // Desmarcar
        : [...prev, value] // Marcar
    );
  };

  // Função para confirmar e fechar
  const handleConfirm = () => {
    onConfirm(tempSelections);
    onClose();
  };

  if (!isOpen) {
    return null; // Não renderiza nada se o modal não estiver aberto
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {options.map(option => (
            <label key={option.value} className="modal-option">
              <input 
                type="checkbox" 
                checked={tempSelections.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
              />
              <span className="custom-checkbox"></span>
              {option.label}
            </label>
          ))}
        </div>
        <div className="modal-footer">
          <button className="confirm-button" onClick={handleConfirm}>
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectModal;