# Sistema de Gestão de Reposição de Aulas - IFCE Campus Boa Viagem

## Objetivo do Sistema

O Sistema de Gestão de Reposição de Aulas é uma aplicação web desenvolvida para automatizar e otimizar o processo de agendamento e confirmação de aulas de reposição no âmbito do IFCE - Campus Boa Viagem. O objetivo é substituir o fluxo manual, que depende de formulários de papel e comunicação informal, por uma plataforma centralizada, ágil e transparente, melhorando a comunicação entre coordenadores, professores, alunos e outros setores envolvidos.


## Equipe e Funções

* **Celso Vieira:** Analista técnico da documentação
* **Erlano Benevides:** Desenvolvedor Fullstack
* **Guilherme Alves:** Analista técnico do protótipo
* **Marcos Barros:** Desenvolvedor Fullstack
* **Rafael Maciel:** Scrum Master e Desenvolvedor Fullstack


## Funcionamento Geral (Fluxo do Usuário)

O fluxo principal do sistema foi modelado para refletir o processo real de reposição de aula, separando as ações por responsável:

* **Coordenador:** Identifica a ausência de um professor e dispara a notificação inicial por e-mail.

* **Professor:** Recebe a notificação e, através da plataforma, cria uma **Solicitação de Reposição**, definindo detalhes como data, horário e sala.

* **Sistema:** Imediatamente após a criação da solicitação, o sistema busca todos os alunos da turma e dispara um e-mail para cada um, contendo um link para o formulário de concordância.

* **Aluno:** Acessa o formulário através do link no e-mail e envia sua resposta, concordando ou não com a reposição.

* **Automação (Google Script ➔ Backend):** A resposta do aluno é enviada para uma planilha. Um script automático detecta a nova resposta e a envia para o backend da aplicação (via webhook), que registra a "assinatura" no banco de dados.

* **Sistema:** A cada assinatura registrada, o backend verifica se o quórum de 75% de concordância foi atingido.
    * **Se sim**, o status da solicitação muda para "Aguardando Aprovação" e a mesma aparece na aba de *Aprovar Reposições* do Coordenador.

* **Coordenador:** Acessa o sistema e avalia a solicitação, podendo **Aprovar** ou **Negar**.

* **Sistema:** Com base na decisão do Coordenador, dispara os e-mails finais de confirmação ou cancelamento para todos os envolvidos (Professor, Alunos e Nutricionista).

* **Professor:** Após a data da aula aprovada, acessa o sistema e **Confirma a Realização** da aula, mudando o status para "Concluída". Isso informa ao Coordenador que a falta pode ser abonada.



## Arquitetura de Arquivos

O projeto é organizado em um monorepo contendo três diretórios principais na raiz: `Backend`, `Frontend` e `doc`, cada um com responsabilidades bem definidas.

### Backend

A arquitetura do backend segue o padrão de camadas (Layered Architecture) para garantir a separação de responsabilidades, a manutenibilidade e a testabilidade do código.

* `config/`: Contém o arquivo de configuração da aplicação (`db.js`).
* `constants/`: Armazena valores constantes e imutáveis utilizados em todo o sistema (Enum de Status).
* `controller/`: Camada responsável por receber as requisições HTTP, validar as entradas e orquestrar as chamadas para os serviços. É a ponte entre as rotas e a lógica de negócio.
* `exceptions/`: Define classes de erro customizadas para um tratamento de exceções mais específico e padronizado (A implementar).
* `model/`: Contém as classes que representam as entidades de negócio do sistema (ex: `Usuario`, `Turma`, `SolicitacaoReposicao`).
* `persistence/`: Implementa o padrão Repository, sendo a única camada que interage diretamente com o banco de dados, executando queries SQL.
* `routes/`: Define todos os endpoints da API, mapeando as URLs e métodos HTTP para as funções correspondentes nos controllers.
* `services/`: Contém a lógica de negócio principal da aplicação. Orquestra as chamadas aos repositórios e executa as regras do sistema.

### Frontend

A arquitetura do frontend é baseada em componentes, seguindo as melhores práticas do ecossistema React para criar uma interface reativa e modular.

* `src/assets/`: Armazena arquivos estáticos como imagens, ícones e fontes.
* `src/components/`: Contém componentes de UI reutilizáveis em várias partes da aplicação (ex: `Modal`, `Navbar`).
* `src/constants/`: Constante utilizada na interface (`SolicitacaoStatus.js`).
* `src/context/`: Implementação da Context API do React para gerenciamento de estado global, com o `AuthContext` que controla a sessão do usuário.
* `src/pages/`: Componentes que representam as páginas completas da aplicação (ex: `LoginPage`, `CoordenadorDashboard`).
* `src/routes/`: Arquivo de configuração centralizada das rotas da aplicação usando `react-router-dom`.
* `src/services/`: Camada responsável pela comunicação com o backend, contendo o arquivo `api.js` com a instância do `axios` e as funções de chamada de API.
* `src/styles/`: Arquivos de estilização globais.

### Documentação (`doc/`)

Este diretório centraliza toda a documentação de planejamento e artefatos gerados durante o desenvolvimento do projeto. Ele serve como uma fonte de consulta para a equipe e inclui o Documento de Requisitos, diagramas UML (Casos de Uso, Classes, Atividades), o script SQL inicial do banco de dados, entre outros.



## Padrões de Projeto (Implementação Inicial)

Para garantir que o código fosse modular, escalável e de fácil manutenção, alguns padrões de projeto foram aplicados na arquitetura do backend.

### Repository

Implementado em toda a camada `persistence/`, este padrão isola a lógica de acesso ao banco de dados do resto da aplicação. Ele cria uma interface clara para realizar operações de CRUD e outras consultas, sem que as camadas de serviço ou controller precisem conhecer os detalhes do SQL. Um bom exemplo é o método `buscarPorMatricula` no arquivo `persistence/ProfessorRepository.js`.

### Singleton

Utilizado no arquivo `config/db.js` para garantir que exista apenas uma única instância do pool de conexões com o banco de dados em toda a aplicação. Isso otimiza o uso de recursos e previne a sobrecarga de múltiplas conexões abertas. A implementação pode ser vista na classe `Database` do arquivo.

### Service Layer (Camada de Serviço)

A camada `services/` atua como uma fachada (Facade) para a lógica de negócio do sistema. Ela orquestra as chamadas para um ou mais repositórios, aplica as regras de negócio (validações, cálculos, etc.) e oferece métodos simples e coesos para a camada de `controller` consumir. O método `confirmar_realizacao` no arquivo `services/ReposicaoService.js` é um ótimo exemplo dessa orquestração.


## Tecnologias Utilizadas

O sistema foi construído com tecnologias modernas e robustas, separadas entre Backend, Frontend e serviços de nuvem.

### Backend

| Tecnologia/Biblioteca | Propósito |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript no servidor. |
| **Express.js** | Framework para a construção da API RESTful, gerenciando rotas e middlewares. |
| **`pg` (node-postgres)** | Driver de conexão para a comunicação com o banco de dados PostgreSQL. |
| **`jsonwebtoken` (JWT)** | Geração e verificação de tokens para autenticação e sessões seguras. |
| **`bcrypt`** | Hashing de senhas para armazenamento seguro no banco de dados. |
| **`nodemailer`** | Envio de e-mails transacionais (notificações) via SMTP. |
| **`cors`** | Middleware para habilitar o Cross-Origin Resource Sharing (CORS), permitindo que o frontend acesse a API. |
| **`dotenv`** | Gerenciamento de variáveis de ambiente. |

### Frontend

| Tecnologia/Biblioteca | Propósito |
| :--- | :--- |
| **React.js** | Biblioteca principal para a construção da interface de usuário de forma componentizada. |
| **Vite** | Ferramenta de build e servidor de desenvolvimento de alta performance. |
| **React Router** | Gerenciamento de rotas e navegação entre as páginas da aplicação. |
| **Axios** | Cliente HTTP para realizar as chamadas para a API do backend. |
| **React Context API**| Gerenciamento de estado global (ex: autenticação). |
| **`chart.js` & `react-chartjs-2`** | Bibliotecas para a criação e exibição de gráficos e dashboards visuais. |
| **React Icons** | Biblioteca para a utilização de ícones na interface. |

### Banco de Dados e Hospedagem

| Plataforma/Serviço | Propósito |
| :--- | :--- |
| **PostgreSQL** | Banco de dados relacional utilizado para a persistência dos dados. |
| **Supabase** | Plataforma de nuvem para a hospedagem e gerenciamento do banco de dados PostgreSQL. |
| **Render** | Plataforma de nuvem para o deploy (hospedagem) contínuo da aplicação backend. |

### Automação e Integrações

| Ferramenta | Propósito |
| :--- | :--- |
| **Google Forms** | Utilizado como interface para a coleta de respostas (assinaturas) dos alunos. |
| **Google Apps Script**| Automação que cria a ponte (webhook) entre as respostas do Google Forms e o backend. |


# 📘 Documentação Final da API - Sistema de Reposição de Aulas

## 🌐 URLs Base
- **Produção:** `https://sistema-de-reposicao-de-aulas.onrender.com`  
- **Local:** `http://localhost:3000`

---

## 🔑 Autenticação (`/auth`)

| Funcionalidade  | Método | Endpoint     | Corpo da Requisição |
|-----------------|--------|-------------|----------------------|
| Realizar Login  | POST   | `/auth/login` | Ver Exemplo |

---

## 👨‍🏫 Professores (`/professor`)

| Funcionalidade       | Método | Endpoint                                | Corpo da Requisição |
|----------------------|--------|-----------------------------------------|----------------------|
| Cadastrar Professor  | POST   | `/professor/cadastrar`                  | Ver Exemplo |
| Listar Professores   | GET    | `/professor`                            | N/A |
| Buscar por Matrícula | GET    | `/professor/:matricula`                 | N/A |
| Atualizar Professor  | PUT    | `/professor/:matricula`                 | Ver Exemplo |
| Deletar Professor    | DELETE | `/professor/:matricula`                 | N/A |
| Iniciar Solicitação  | POST   | `/professor/solicitar-reposicao`        | Ver Exemplo |
| Associar Disciplinas | POST   | `/professor/:matricula/disciplinas`     | Ver Exemplo |

---

## 👨‍💼 Coordenadores (`/coordenador`)

| Funcionalidade        | Método | Endpoint                                                      | Corpo da Requisição |
|-----------------------|--------|---------------------------------------------------------------|----------------------|
| Cadastrar Coordenador | POST   | `/coordenador/cadastrar`                                      | Ver Exemplo |
| Listar Coordenadores  | GET    | `/coordenador`                                                | N/A |
| Buscar por Matrícula  | GET    | `/coordenador/:matricula`                                     | N/A |
| Atualizar Coordenador | PUT    | `/coordenador/:matricula`                                     | Ver Exemplo |
| Deletar Coordenador   | DELETE | `/coordenador/:matricula`                                     | N/A |
| Notificar Falta       | POST   | `/coordenador/professores/:matricula/notificar-falta`         | N/A |
| Avaliar Solicitação   | POST   | `/coordenador/solicitacoes/:id_solicitacao/avaliar`           | Ver Exemplo |

---

## 🎓 Alunos (`/aluno`)

| Funcionalidade        | Método | Endpoint                           | Corpo da Requisição |
|-----------------------|--------|------------------------------------|----------------------|
| Cadastrar Aluno       | POST   | `/aluno`                           | Ver Exemplo |
| Buscar por Matrícula  | GET    | `/aluno/:matricula`                | N/A |
| Listar Turmas do Aluno| GET    | `/aluno/:matricula/turmas`         | N/A |

---

## 🏫 Turmas (`/turmas`)

| Funcionalidade           | Método | Endpoint                                    | Corpo da Requisição |
|--------------------------|--------|---------------------------------------------|----------------------|
| Criar Turma              | POST   | `/turmas`                                   | Ver Exemplo |
| Listar Turmas            | GET    | `/turmas`                                   | N/A |
| Buscar por ID            | GET    | `/turmas/:id_turma`                         | N/A |
| Atualizar Turma          | PUT    | `/turmas/:id_turma`                         | Ver Exemplo |
| Deletar Turma            | DELETE | `/turmas/:id_turma`                         | N/A |
| Adicionar Aluno à Turma  | POST   | `/turmas/:id_turma/alunos`                  | Ver Exemplo |
| Remover Aluno da Turma   | DELETE | `/turmas/:id_turma/alunos/:matricula_aluno` | N/A |

---

## 📄 Reposições (`/reposicao`)

| Funcionalidade          | Método | Endpoint                                             | Corpo da Requisição |
|-------------------------|--------|------------------------------------------------------|----------------------|
| Criar Solicitação       | POST   | `/reposicao`                                         | Ver Exemplo |
| Listar Solicitações     | GET    | `/reposicao`                                         | N/A |
| Listar Autorizadas      | GET    | `/reposicao/autorizadas`                             | N/A |
| Listar Pendentes        | GET    | `/reposicao/pendentes-aprovacao`                     | N/A |
| Buscar por ID           | GET    | `/reposicao/:id_solicitacao`                         | N/A |
| Buscar Assinaturas      | GET    | `/reposicao/:id_solicitacao/assinaturas`             | N/A |
| Atualizar Status        | PUT    | `/reposicao/:id_solicitacao/status`                  | Ver Exemplo |
| Confirmar Realização    | POST   | `/reposicao/:id_solicitacao/confirmar-realizacao`    | Ver Exemplo |

---

## 📌 Outras Rotas

| Funcionalidade        | Método | Endpoint                      | Corpo da Requisição |
|-----------------------|--------|-------------------------------|----------------------|
| Criar Disciplina      | POST   | `/disciplinas`                | Ver Exemplo |
| Listar Disciplinas    | GET    | `/disciplinas`                | N/A |
| Buscar Disciplina     | GET    | `/disciplinas/:codigo`        | N/A |
| Criar Nutricionista   | POST   | `/nutricionistas`             | Ver Exemplo |
| Atualizar Nutricionista | PUT  | `/nutricionistas/:id`         | Ver Exemplo |
| Webhook (Google Forms)| POST   | `/webhook/google-form`        | Uso interno |

---

## 📂 Exemplos de Corpo (Body) das Requisições

<details>
<summary><strong>Clique para expandir/recolher</strong></summary>

### 🔑 Autenticação
```json
{
  "email": "email_cadastrado@email.com",
  "senha": "senha_do_usuario"
}
```

### 👨‍🏫 Professor
**Cadastrar Professor**
```json
{
  "nome": "Nome Completo do Professor",
  "email": "professor.novo@email.com",
  "matricula": 123456,
  "senha": "senhaSegura123",
  "disciplinas": []
}
```

**Atualizar Professor**
```json
{
  "nome": "Nome do Professor Atualizado",
  "email": "email.atualizado@email.com"
}
```

**Associar Disciplinas**
```json
{
  "disciplinas": [1, 2]
}
```

### 👨‍💼 Coordenador
**Cadastrar Coordenador**
```json
{
  "nome": "Nome Completo do Coordenador",
  "email": "coordenador.novo@email.com",
  "matricula": 789012,
  "senha": "senhaAdmin456",
  "departamento": "Ciência da Computação"
}
```

**Atualizar Coordenador**
```json
{
  "nome": "Nome Coordenador Atualizado",
  "email": "coord.atualizado@email.com",
  "departamento": "Engenharia de Software"
}
```

**Avaliar Solicitação**
```json
{
  "decisao": "AUTORIZADA",
  "comentario": "Horário disponível."
}
```

### 🎓 Aluno
**Cadastrar Aluno**
```json
{
  "nome": "Nome Completo do Aluno",
  "email": "aluno.novo@email.com",
  "matricula_aluno": 112233,
  "turmas": [1, 2]
}
```

### 🏫 Turma
**Criar Turma**
```json
{
  "nome": "Sistemas de Informação - S1",
  "semestre": "2025.2",
  "matriculas_alunos": [112233]
}
```

**Atualizar Turma**
```json
{
  "nome": "Sistemas de Informação - S1 (Atualizado)",
  "semestre": "2025.2",
  "matriculas_alunos": [112233, 112234]
}
```

**Adicionar Aluno à Turma**
```json
{
  "matricula_aluno": 112233
}
```

### 📄 Reposição
**Criar Solicitação**
```json
{
  "motivo": "Participação em Evento Acadêmico",
  "data": "2025-10-30",
  "horario": "08:00 - 09:30",
  "sala": "Auditório",
  "qt_alunos": 35,
  "idTurma": 1,
  "idProfessor": 123456
}
```

**Atualizar Status**
```json
{
  "status": "CONCLUIDA"
}
```

**Confirmar Realização**
```json
{
  "email_coordenador": "email.do.coordenador@ifce.edu.br"
}
```

### 📚 Disciplinas
**Criar Disciplina**
```json
{
  "nome": "Inteligência Artificial",
  "cargaHoraria": 60,
  "codigo": "COMP-001",
	"professores": []
}
```

### 🥗 Nutricionista
**Criar Nutricionista**
```json
{
  "nome": "Nome do Nutricionista",
  "email": "nutri@email.com"
}
```

**Atualizar Nutricionista**
```json
{
  "nome": "Nome Atualizado do Nutricionista",
  "email": "novo.nutri@email.com"
}
```
</details>


## Pontos de melhoria

* Migrar o uso de email para sendgrid
* Adicionar status de carregamento a todas as funcionalidades
* Alterar lógica para que um coordenador também possa ser professor