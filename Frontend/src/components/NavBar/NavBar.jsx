import React from 'react';
import './Navbar.css';
import IFCE from '../../assets/logo-branca.png';
import { NavLink, useLocation } from 'react-router-dom';

// {/* --- INÍCIO DA MUDANÇA --- */}
// 1. Importamos o hook de autenticação para pegar os dados do usuário
import { useAuth } from '../../context/AuthContext'; // ATENÇÃO: Verifique se este é o caminho correto para seu AuthContext

// 2. As listas de links agora ficam centralizadas aqui dentro da Navbar
const coordinatorNavLinks = [
  { name: 'Gerenciar Professores', path: '/coordenador/professores' },
  { name: 'Gerenciar Turma', path: '/coordenador/turmas' },
  { name: 'Aprovar Reposições', path: '/coordenador/aprovar-reposicoes' },
];

const professorNavLinks = [
  // ATENÇÃO: Coloque aqui os caminhos corretos para as páginas do professor
  { name: 'Solicitar Reposição', path: '/professor/solicitar-reposicao' },
  { name: 'Minhas Reposições', path: '/professor/minhas-reposicoes' },
  { name: 'Visualizar Assinaturas', path: '/professor/assinaturas' },
];
// {/* --- FIM DA MUDANÇA --- */}


// {/* --- INÍCIO DA MUDANÇA --- */}
// 3. O componente não recebe mais nenhuma informação de fora (props)
const Navbar = () => {
// {/* --- FIM DA MUDANÇA --- */}

  const defaultAvatar = 'https://i.pravatar.cc/150';
  
  // {/* --- INÍCIO DA MUDANÇA --- */}
  // 4. A Navbar agora busca as informações que precisa usando hooks
  const { usuario } = useAuth();
  const location = useLocation();
  // {/* --- FIM DA MUDANÇA --- */}



  
  const dashboardRoutes = ['/coordenador/dashboard', '/professor/dashboard'];
  const isDashboard = dashboardRoutes.includes(location.pathname);

  // {/* --- INÍCIO DA MUDANÇA --- */}
  // 5. Lógica interna para decidir quais links mostrar
  // ATENÇÃO: Verifique se a propriedade do cargo é 'usuario.cargo' ou similar
  const navLinksParaMostrar = usuario?.matriculaCoordenador ? coordinatorNavLinks : professorNavLinks;
  // {/* --- FIM DA MUDANÇA --- */}

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src={IFCE} alt="Logo IFCE" className="header-logo" />
      </div>

      {/* 6. A lógica de renderização agora usa as variáveis internas que criamos */}
      {!isDashboard && navLinksParaMostrar && navLinksParaMostrar.length > 0 && (
        <nav className="navbar-center">
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

      <div className="navbar-right">
        <div className="navbar-user-profile">
          <div className="user-info">
            {/* --- INÍCIO DA MUDANÇA --- */}
            {/* 7. As informações vêm direto do hook 'useAuth' em vez das props */}
            <span className="user-name">{usuario ? usuario.nome.toUpperCase() : ''}</span>
            <span className="user-id">{usuario ? (usuario.matriculaCoordenador || usuario.matriculaProfessor) : ''}</span>
            {/* --- FIM DA MUDANÇA --- */}
          </div>
          <img
            // {/* --- INÍCIO DA MUDANÇA --- */}
            src={(usuario?.avatar) || defaultAvatar}
            // {/* --- FIM DA MUDANÇA --- */}
            alt="Avatar do usuário"
            className="user-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;