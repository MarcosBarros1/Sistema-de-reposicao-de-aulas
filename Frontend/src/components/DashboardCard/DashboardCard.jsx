import React from 'react';
import './DashboardCard.css';

// Adicionamos a prop 'onButtonClick'
const DashboardCard = ({ title, children, onButtonClick }) => {
  return (
    <div className="dashboard-card">
      <h3 className="card-title">{title}</h3>
      <div className="card-icon">
        {children}
      </div>
      {/* O botão agora chama a função que foi passada via props */}
      <button className="card-button" onClick={onButtonClick}>
        Acessar
      </button>
    </div>
  );
};

export default DashboardCard;