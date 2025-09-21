import React from 'react';
import { useParams } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import SideBanner from '../../components/SideBanner/SideBanner';
import './Login.css'; // Criaremos este arquivo para o layout

const Login = () => {
    const { tipo_usuario } = useParams();

    return (
        <div className="login-page-container">
            <div className="side-banner-container">
                <SideBanner />
            </div>
            <div className="login-form-area">
                <LoginForm tipo_usuario={tipo_usuario} />
            </div>
        </div>
    );
};

export default Login;