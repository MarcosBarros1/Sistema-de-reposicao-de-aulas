# Sistema de Reposição de Aulas - IFCE Boa Viagem

Este é um sistema desenvolvido pelos alunos do **IFCE - Campus Boa Viagem** para o gerenciamento do processo de reposição de aulas.  

A API foi construída no modelo **RESTful** e gerencia usuários, turmas, solicitações e o fluxo de notificações do sistema.

---

## 📌 Estrutura da API

As rotas estão divididas em duas categorias principais:

- **Rotas de CRUD** → operações de criação, leitura, atualização e exclusão.  
- **Rotas de Ação** → executam regras de negócio específicas do sistema.  

---

## 🔹 Rotas de CRUD

### 👨‍🏫 Professor (`/professor`)

| Funcionalidade       | Método | Endpoint                 | Body |
|-----------------------|--------|--------------------------|------|
| Cadastrar Professor   | POST   | `/professor/cadastrar`  | ✅ |
| Listar Professores    | GET    | `/professor`            | ❌ |
| Buscar por Matrícula  | GET    | `/professor/:matricula` | ❌ |
| Atualizar Professor   | PUT    | `/professor/:matricula` | ✅ |
| Deletar Professor     | DELETE | `/professor/:matricula` | ❌ |

---

### 📋 Coordenador (`/coordenador`)

| Funcionalidade         | Método | Endpoint                   | Body |
|-------------------------|--------|----------------------------|------|
| Cadastrar Coordenador   | POST   | `/coordenador/cadastrar`  | ✅ |
| Listar Coordenadores    | GET    | `/coordenador`            | ❌ |
| Buscar por Matrícula    | GET    | `/coordenador/:matricula` | ❌ |
| Atualizar Coordenador   | PUT    | `/coordenador/:matricula` | ✅ |
| Deletar Coordenador     | DELETE | `/coordenador/:matricula` | ❌ |

---

### 👨‍🎓 Aluno (`/aluno`)

| Funcionalidade        | Método | Endpoint              | Body |
|------------------------|--------|-----------------------|------|
| Cadastrar Aluno        | POST   | `/aluno`             | ✅ |
| Buscar por Matrícula   | GET    | `/aluno/:matricula`  | ❌ |

---

### 🏫 Turma (`/turmas`)

| Funcionalidade       | Método | Endpoint                                | Body |
|-----------------------|--------|-----------------------------------------|------|
| Criar Turma           | POST   | `/turmas`                              | ✅ |
| Listar Turmas         | GET    | `/turmas`                              | ❌ |
| Buscar por ID         | GET    | `/turmas/:id_turma`                    | ❌ |
| Adicionar Aluno       | POST   | `/turmas/:id_turma/alunos`             | ✅ |
| Remover Aluno         | DELETE | `/turmas/:id_turma/alunos/:matricula_aluno` | ❌ |

---

### 📅 Reposição (`/reposicoes`)

| Funcionalidade         | Método | Endpoint                  | Body |
|-------------------------|--------|---------------------------|------|
| Criar Solicitação       | POST   | `/reposicoes`            | ✅ |
| Listar Solicitações     | GET    | `/reposicoes`            | ❌ |
| Buscar por ID           | GET    | `/reposicoes/:id`        | ❌ |
| Atualizar Status        | PUT    | `/reposicoes/:id/status` | ✅ |

---

## 🔹 Rotas de Ação

| Funcionalidade                 | Método | Endpoint                                                      | Body |
|--------------------------------|--------|---------------------------------------------------------------|------|
| Realizar Login                 | POST   | `/auth/login`                                                | ✅ |
| Notificar Falta (Coord.)       | POST   | `/coordenador/professores/:matricula/notificar-falta`        | ❌ |
| Iniciar Solicitação (Prof.)    | POST   | `/professor/solicitar-reposicao`                             | ✅ |
| Avaliar Solicitação (Coord.)   | POST   | `/coordenador/solicitacoes/:id_solicitacao/avaliar`          | ✅ |

---

## 📦 Exemplos de Corpo (JSON)

### ➕ Cadastrar Professor
```json
{
  "nome": "Nome Completo do Professor",
  "email": "professor.novo@email.com",
  "matricula": 123456,
  "senha": "senhaSegura123",
  "disciplinas": []
}
```

### ✏️ Atualizar Professor
```json
{
  "nome": "Nome do Professor Atualizado",
  "email": "email.atualizado@email.com"
}
```

### ➕ Cadastrar Coordenador
```json
{
  "nome": "Nome Completo do Coordenador",
  "email": "coordenador.novo@email.com",
  "matricula": 789012,
  "senha": "senhaAdmin456",
  "departamento": "Ciência da Computação"
}
```

### ✏️ Atualizar Coordenador
```json
{
  "nome": "Nome Coordenador Atualizado",
  "email": "coord.atualizado@email.com",
  "departamento": "Engenharia de Software"
}
```

### ➕ Cadastrar Aluno
```json
{
  "nome": "Nome Completo do Aluno",
  "email": "aluno.novo@email.com",
  "matricula_aluno": 112233,
  "turmas": [1, 2]
}
```

### ➕ Criar Turma
```json
{
  "nome": "Sistemas de Informação - S1",
  "semestre": "2025.2"
}
```

### ➕ Adicionar Aluno à Turma
```json
{
  "matricula_aluno": 112233
}
```

### ➕ Criar Solicitação de Reposição
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

### ✏️ Atualizar Status da Solicitação
```json
{
  "status": "CONCLUIDA"
}
```

### 🔑 Login
```json
{
  "email": "email_cadastrado@email.com",
  "senha": "senha_do_usuario"
}
```

### 📝 Iniciar Solicitação de Reposição
```json
{
  "motivo": "Viagem para Congresso",
  "data": "2025-11-15",
  "horario": "14:00 - 15:30",
  "sala": "Lab 01",
  "idTurma": 1,
  "idProfessor": 123456
}
```

### ✅ Avaliar Solicitação (Aprovar)
```json
{
  "decisao": "AUTORIZADA"
}
```

### ❌ Avaliar Solicitação (Negar)
```json
{
  "decisao": "NEGADA",
  "comentario": "Conflito de horário com outra turma na mesma sala."
}
```
