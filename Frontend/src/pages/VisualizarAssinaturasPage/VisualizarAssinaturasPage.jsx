import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/NavBar';
import './VisualizarAssinaturasPage.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// 1. Importe a nova função que criamos na nossa API
import { buscarAssinaturasPorReposicao } from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const VisualizarAssinaturasPage = () => {
  const userData = { name: "Márcio (Professor)", id: "Matrícula do Professor", avatar: "" };

  // 2. Criamos novos estados para controlar o ciclo de vida dos dados
  const [alunos, setAlunos] = useState([]); // Para a lista da tabela
  const [chartData, setChartData] = useState(null); // Para os dados do gráfico
  const [loading, setLoading] = useState(true); // Para saber se estamos carregando os dados
  const [error, setError] = useState(null); // Para armazenar qualquer erro da API

  // 3. useEffect: a mágica para buscar dados quando o componente carrega
  useEffect(() => {
    // Função assíncrona para buscar e processar os dados
    const fetchAssinaturas = async () => {
      try {
        // No futuro, o '1' virá da URL (ex: /reposicoes/1/assinaturas)
        // Usaremos o hook useParams do react-router-dom para isso
        const idReposicao = 1; // ID de exemplo
        const data = await buscarAssinaturasPorReposicao(idReposicao);

        // Atualiza o estado com os alunos recebidos
        setAlunos(data.alunos || []);

        // Prepara os dados para o gráfico de pizza
        const stats = data.stats; // Ex: { presentes: 18, ausentes: 5, pendentes: 7 }
        if (stats) {
          setChartData({
            labels: ['Presentes', 'Ausentes', 'Pendentes'],
            datasets: [{
              data: [stats.presentes, stats.ausentes, stats.pendentes],
              backgroundColor: ['#2E8B57', '#DC3545', '#6c757d'],
              borderColor: ['#FFFFFF'],
              borderWidth: 2,
            }],
          });
        }
      } catch (err) {
        setError("Falha ao carregar os dados de assinaturas. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        // Independentemente de sucesso ou erro, paramos o carregamento
        setLoading(false);
      }
    };

    fetchAssinaturas(); // Chama a função
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // Opções do gráfico (pode ser movido para fora do componente se não mudar)
  const chartOptions = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  // 4. Renderização condicional: mostramos diferentes coisas baseadas no estado
  if (loading) {
    return (
      <div className="page-container">
        <Navbar {...userData} />
        <div className="content-area content-wrapper"><h1>Carregando Assinaturas...</h1></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Navbar {...userData} />
        <div className="content-area content-wrapper"><h1>{error}</h1></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar {...userData} />
      <div className="content-area">
        <div className="content-wrapper">
          <div className="page-header"><h1>Assinaturas</h1></div>
          <div className="stats-container">
            <div className="table-section">
              <div className="table-container">
                <table>
                  <thead><tr><th>Nome</th><th>E-mail</th></tr></thead>
                  <tbody>
                    {alunos.map(aluno => (
                      <tr key={aluno.id}><td>{aluno.nome}</td><td>{aluno.email}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {chartData && (
              <div className="chart-section">
                <div className="chart-wrapper"><Pie data={chartData} options={chartOptions} /></div>
                <div className="chart-legend">
                  {chartData.labels.map((label, index) => (
                    <div className="legend-item" key={label}>
                      <span className="legend-color-box" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}></span>
                      {label} ({chartData.datasets[0].data[index]})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizarAssinaturasPage;