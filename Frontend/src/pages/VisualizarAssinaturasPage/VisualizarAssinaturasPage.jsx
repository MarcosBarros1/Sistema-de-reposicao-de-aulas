import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/NavBar';
import { useParams } from 'react-router-dom';
import './VisualizarAssinaturasPage.css';

// Importando as ferramentas para o gráfico e a função da API
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { buscarAssinaturasPorReposicao } from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const VisualizarAssinaturasPage = () => {
  // O hook useParams pega os parâmetros da URL, como o :id_solicitacao da rota
  const { id_solicitacao } = useParams();

  // Estados para os dados, carregamento e erros
  const [alunos, setAlunos] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [reposicaoInfo, setReposicaoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar os dados da API quando o componente carregar
  useEffect(() => {
    const fetchData = async () => {
      if (!id_solicitacao || isNaN(id_solicitacao)) {
        setError("ID da reposição inválido.");
        setLoading(false);
        return; // Para a execução se o ID não for um número válido
      }
      try {
        const data = await buscarAssinaturasPorReposicao(id_solicitacao);
        
        setAlunos(data.alunos || []);
        setReposicaoInfo(data.reposicao || {});

        // Configura os dados para o gráfico de pizza
        if (data.stats) {
          setChartData({
            labels: ['Concordaram', 'Discordaram', 'Pendentes'],
            datasets: [{
              data: [data.stats.presentes, data.stats.ausentes, data.stats.pendentes],
              backgroundColor: ['#28a745', '#dc3545', '#6c757d'],
              borderColor: '#ffffff',
              borderWidth: 2,
            }],
          });
        }
      } catch (err) {
        setError("Falha ao carregar os dados. Verifique a conexão ou tente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_solicitacao]); // O efeito roda novamente se o ID na URL mudar

  const chartOptions = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  const userData = { name: "Professor", id: "Matrícula", avatar: "" };

  // Renderização condicional para os estados de carregamento e erro
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
          <div className="page-header">
            <h1>Assinaturas da Reposição</h1>
            {reposicaoInfo && <h2>{reposicaoInfo.disciplina} - {reposicaoInfo.data}</h2>}
          </div>

          <div className="stats-container">
            {/* Seção da Tabela (Esquerda) */}
            <div className="table-section">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nome do Aluno</th>
                      <th>E-mail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map(aluno => (
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
            {chartData && (
              <div className="chart-section">
                <div className="chart-wrapper">
                  <Pie data={chartData} options={chartOptions} />
                </div>
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