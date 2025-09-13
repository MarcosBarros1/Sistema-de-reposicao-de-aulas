const express = require('express');
const reposicaoRoutes = require('./routes/ReposicaoRoutes');

const app = express();
app.use(express.json());

// Rotas de Solicitações
app.use('/reposicoes', reposicaoRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
