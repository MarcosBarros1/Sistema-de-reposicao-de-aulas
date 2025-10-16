import React from 'react';
import './Navbar.css';
import IFCE from '../../assets/logo-branca.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const coordinatorNavLinks = [
  { name: 'Gerenciar Professores', path: '/coordenador/professores' },
  { name: 'Gerenciar Turma', path: '/coordenador/turmas' },
  { name: 'Aprovar Reposições', path: '/coordenador/aprovar-reposicoes' },
];

const professorNavLinks = [
  { name: 'Solicitar Reposição', path: '/professor/solicitar-reposicao' },
  { name: 'Minhas Reposições', path: '/professor/minhas-reposicoes' },
  { name: 'Confirmar Aulas', path: '/professor/confirmar-aula' },
];

const Navbar = () => {
  const defaultAvatar = 'https://i.pravatar.cc/150';
  
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  
  const dashboardRoutes = ['/coordenador/dashboard', '/professor/dashboard'];
  const isDashboard = dashboardRoutes.includes(location.pathname);

  const navLinksParaMostrar = usuario?.matriculaCoordenador ? coordinatorNavLinks : professorNavLinks;

  // função que será chamada ao clicar em "Sair"
  const handleLogout = () => {
    logout(); // Limpa os dados de autenticação
    navigate('/'); // Redireciona para a página inicial
  };

  return (
    <header className="Navbar">
      <div className="Navbar-left">
        <img src={IFCE} alt="Logo IFCE" className="header-logo" />
      </div>

      {!isDashboard && navLinksParaMostrar && navLinksParaMostrar.length > 0 && (
        <nav className="Navbar-center">
          {navLinksParaMostrar.map(link => (
            <NavLink 
              key={link.name} 
              to={link.path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="Navbar-right">
        <div className="Navbar-user-profile">
          <div className="user-info">
            <div className="user-name-container">
              <button className="logout-button" onClick={handleLogout}>
                Sair
              </button>
              <span className="user-name">{usuario ? usuario.nome.toUpperCase() : ''}</span>
            </div>
            <span className="user-id">{usuario ? (usuario.matriculaCoordenador || usuario.matriculaProfessor) : ''}</span>
          </div>
          <img
            src={(usuario?.avatar) || defaultAvatar}
            alt="Avatar do usuário"
            className="user-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;