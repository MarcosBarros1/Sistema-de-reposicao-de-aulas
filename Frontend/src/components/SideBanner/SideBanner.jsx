import React from 'react';
import './SideBanner.css';
import logoIFCE from '../../assets/logo-ifce.png'; // Importando a imagem

function SideBanner() {
  return (
    <div className="side-banner-container">
      <img src={logoIFCE} alt="Logo do Instituto Federal do Ceará" className="logo" />
      <h2 className="system-title">Sistema de Reposição de Aulas</h2>
    </div>
  );
}

export default SideBanner;