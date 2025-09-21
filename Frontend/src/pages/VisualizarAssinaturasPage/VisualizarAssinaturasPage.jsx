import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import './VisualizarAssinaturasPage.css';

// 1. Importando as ferramentas para o gráfico
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// 2. Registrando os componentes necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Dados de exemplo para a tabela de alunos. Virá da API no futuro.
const mockAlunos = [
  { id: 1, nome: 'Maria Silva', email: 'maria.silva@email.com' },
  { id: 2, nome: 'Carlos Souza', email: 'carlos.souza@email.com' },
  { id: 3, nome: 'Ana Lima', email: 'ana.lima@email.com' },
  { id: 4, nome: 'Pedro Costa', email: 'pedro.costa@email.com' },
  { id: 5, nome: 'Joana Pereira', email: 'joana.pereira@email.com' },
  { id: 6, nome: 'Lucas Martins', email: 'lucas.martins@email.com' },
  { id: 7, nome: 'Sofia Almeida', email: 'sofia.almeida@email.com' },
];

const VisualizarAssinaturasPage = () => {
  const userData = { name: "Márcio (Professor)", id: "Matrícula do Professor", avatar: "" };

  // 3. Dados e configuração para o gráfico de pizza
  const chartData = {
    labels: ['Presentes', 'Ausentes', 'Pendentes'],
    datasets: [
      {
        label: '# de Alunos',
        data: [18, 5, 7], // Dados de exemplo: 18 presentes, 5 ausentes, 7 pendentes
        backgroundColor: [
          '#2E8B57', // Verde para Presentes
          '#DC3545', // Vermelho para Ausentes
          '#6c757d', // Cinza para Pendentes
        ],
        borderColor: [
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false, // Vamos criar nossa própria legenda
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="page-container">
      <Navbar {...userData} />
      <div className="content-area">
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Assinaturas</h1>
          </div>

          <div className="stats-container">
            {/* Seção da Tabela (Esquerda) */}
            <div className="table-section">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAlunos.map(aluno => (
                      <tr key={aluno.id}>
                        <td>{aluno.nome}</td>
                        <td>{aluno.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Seção do Gráfico (Direita) */}
            <div className="chart-section">
              <div className="chart-wrapper">
                <Pie data={chartData} options={chartOptions} />
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color-box" style={{ backgroundColor: '#2E8B57' }}></span>
                  Presentes (18)
                </div>
                <div className="legend-item">
                  <span className="legend-color-box" style={{ backgroundColor: '#DC3545' }}></span>
                  Ausentes (5)
                </div>
                <div className="legend-item">
                  <span className="legend-color-box" style={{ backgroundColor: '#6c757d' }}></span>
                  Pendentes (7)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizarAssinaturasPage;