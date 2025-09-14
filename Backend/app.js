//app.js
const express = require('express');
const cors = require('cors');

// Importa os arquivos de rota
const professorRoutes = require('./routes/ProfessorRoutes');
const coordenadorRoutes = require('./routes/CoordenadorRoutes');
const reposicaoRoutes = require('./routes/ReposicaoRoutes')
const autenticacaoRoutes = require('./routes/AuthRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // Middleware para o Express entender JSON


// Rotas principais
app.use('/professor', professorRoutes);
app.use('/coordenador', coordenadorRoutes);
app.use('/reposicoes', reposicaoRoutes);
app.use('/auth', autenticacaoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Sistema de Reposição de Aulas - IFCE Boa Viagem');
});

module.exports = app; // Exportamos o app para ser usado pelo server.js