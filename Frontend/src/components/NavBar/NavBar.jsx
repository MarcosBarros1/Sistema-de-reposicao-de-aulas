import React from 'react';
import './Navbar.css';
import IFCE from '../../assets/logo-branca.png'


// Importando os ícones que vamos usar
import { FaBars, FaRegBell, FaCog } from 'react-icons/fa';

// O componente recebe props para as informações dinâmicas do usuário
const Navbar = ({ userName, userIdentifier, userAvatarUrl }) => {
  // URL de um avatar padrão caso nenhuma seja fornecida
  const defaultAvatar = 'https://i.pravatar.cc/150';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={IFCE} className="header-logo" />
      </div>

      <div className="navbar-right">
        <div className="navbar-user-profile">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-id">{userIdentifier}</span>
          </div>
          <img
            src={userAvatarUrl || defaultAvatar}
            alt="Avatar do usuário"
            className="user-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;