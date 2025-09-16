// app.js
const express = require('express');
const cors = require('cors');

// Importa os arquivos de rota
const professorRoutes = require('./routes/ProfessorRoutes');
const coordenadorRoutes = require('./routes/CoordenadorRoutes');
const reposicaoRoutes = require('./routes/ReposicaoRoutes');
const disciplinaRoutes = require('./routes/DisciplinaRoutes'); 
const autenticacaoRoutes = require('./routes/AuthRoutes');
const alunoRoutes = require('./routes/AlunoRoutes');
const turmaRoutes = require('./routes/TurmaRoutes');
const nutricionistaRoutes = require('./routes/NutricionistaRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // Middleware para o Express entender JSON

// Rotas principais
app.use('/professor', professorRoutes);
app.use('/coordenador', coordenadorRoutes);
app.use('/reposicao', reposicaoRoutes);
app.use('/disciplina', disciplinaRoutes); 
app.use('/auth', autenticacaoRoutes);
app.use('/aluno', alunoRoutes);
app.use('/turmas', turmaRoutes);
app.use('/nutricionistas', nutricionistaRoutes);
app.use('/webhook', webhookRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Sistema de Reposição de Aulas - IFCE Boa Viagem');
});

module.exports = app; // Exportamos o app para ser usado pelo server.js
