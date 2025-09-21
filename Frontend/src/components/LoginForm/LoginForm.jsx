import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa'; // Ícones para os campos
import './LoginForm.css';
import logoIFCE from '../../assets/logo-ifce.png';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Recebe a prop 'tipo_usuario'
const LoginForm = ({ tipo_usuario }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setError] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { login } = useAuth(); // 2. Pegue a função de login do contexto
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Limpa erros antigos
        setCarregando(true);

        try {
            // 3. Chame a função de login do contexto
            const usuarioLogado = await login(email, senha);

            // 4. Lógica de redirecionamento
            if (usuarioLogado.tipo.toLowerCase() === 'coordenador') {
                navigate('/coordenador/dashboard');
            } else if (usuarioLogado.tipo.toLowerCase() === 'professor') {
                navigate('/professor/dashboard');
            } else {
                navigate('/inicio'); // Rota padrão
            }

        } catch (err) {
            // 2. Captura o erro da API e atualiza o estado
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setCarregando(false); // Finaliza o feedback de carregamento
        }
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
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
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