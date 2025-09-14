// server.js

// 1. Importa a nossa aplicação Express configurada do arquivo app.js
const app = require('./app');

// 2. Define a porta onde o servidor irá rodar.
//    Ele tenta pegar a porta de uma variável de ambiente
//    ou usa a porta 3000 como padrão.
const PORT = process.env.PORT || 3000;

// 3. Inicia o servidor e o faz escutar na porta definida.
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando e escutando na porta http://localhost:${PORT}`);
});