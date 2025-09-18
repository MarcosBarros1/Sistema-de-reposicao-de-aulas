import React from 'react';
import './DashboardCard.css';

// Recebe 'title' e 'children' como propriedades. 
// 'children' será o ícone que passarmos para ele.
const DashboardCard = ({ title, children }) => {
  return (
    <div className="dashboard-card">
      <h3 className="card-title">{title}</h3>
      <div className="card-icon">
        {children}
      </div>
      <button className="card-button">Acessar</button>
    </div>
  );
};

export default DashboardCard;