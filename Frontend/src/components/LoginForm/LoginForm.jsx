import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import './LoginForm.css';
import logoIFCE from '../../assets/logo-ifce.png';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ tipo_usuario }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false); 
    const [erro, setError] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setCarregando(true);

        try {
            const usuarioLogado = await login(email, senha);

            if (usuarioLogado.tipo.toLowerCase() === 'coordenador') {
                navigate('/coordenador/dashboard');
            } else if (usuarioLogado.tipo.toLowerCase() === 'professor') {
                navigate('/professor/dashboard');
            } else {
                navigate('/inicio');
            }

        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setCarregando(false);
        }
    };

    // Função para alternar a visibilidade da senha
    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    return (
        <div className="login-form-container">
            <img src={logoIFCE} alt="Logo do IFCE" className="login-logo" />
            <h2>Acesso ao Sistema</h2>
            <p>Bem-vindo! Por favor, insira suas credenciais.</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type={mostrarSenha ? 'text' : 'password'} 
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    {/* Ícone para ver/esconder a senha */}
                    <span onClick={toggleMostrarSenha} className="password-toggle-icon">
                        {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {erro && <p className="error-message">{erro}</p>}

                <button type="submit" className="login-button" disabled={carregando}>
                    {carregando ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <a href="#" className="forgot-password-link">
                Esqueceu sua senha?
            </a>
        </div>
    );
};

export default LoginForm;