// app.js
const express = require('express');
const cors = require('cors');

// Importa os arquivos de rota
const professorRoutes = require('./routes/ProfessorRoutes');
const coordenadorRoutes = require('./routes/CoordenadorRoutes');
const reposicaoRoutes = require('./routes/ReposicaoRoutes');
const disciplinaRoutes = require('./routes/DisciplinaRoutes'); 
const autenticacaoRoutes = require('./routes/AuthRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // Middleware para o Express entender JSON

// Rotas principais
app.use('/professores', professorRoutes);
app.use('/coordenadores', coordenadorRoutes);
app.use('/reposicoes', reposicaoRoutes);
app.use('/disciplinas', disciplinaRoutes); 
app.use('/auth', autenticacaoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Sistema de Reposição de Aulas - IFCE Boa Viagem');
});

module.exports = app; // Exportamos o app para ser usado pelo server.js
