// test_connection.js

// Importa a instância única do banco de dados que configuramos
const db = require('./config/db');

// Cria uma função assíncrona para podermos usar 'await'
async function runTest() {
  console.log('Iniciando teste de conexão com o PostgreSQL...');

  try {
    // Tenta executar uma query muito simples que retorna a hora atual do servidor do banco
    const result = await db.query('SELECT NOW()');

    // Se a query funcionar, a conexão está OK!
    console.log('✅ Conexão com o banco de dados bem-sucedida!');
    console.log('Horário atual retornado pelo banco:', result.rows[0].now);

  } catch (error) {
    // Se ocorrer um erro, a conexão falhou.
    console.error('❌ Erro ao conectar com o banco de dados:');
    console.error(error.message); // Exibe a mensagem de erro específica

  } finally {
    // É importante fechar o pool de conexões para que o script termine
    if (db.pool) {
      await db.pool.end();
      console.log('Conexão com o banco de dados fechada.');
    }
  }
}

// Executa a função de teste
runTest();