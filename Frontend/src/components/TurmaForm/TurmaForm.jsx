import React, { useState, useEffect } from 'react';

const TurmaForm = ({ on_submit, on_cancel, turma_para_editar }) => {
    const [nome, set_nome] = useState('');
    const [semestre, set_semestre] = useState('');
    const [alunos_str, set_alunos_str] = useState('')

    // useEffect para preencher o formulário quando estiver em modo de edição
    useEffect(() => {
        if (turma_para_editar) {
            set_nome(turma_para_editar.nome);
            set_semestre(turma_para_editar.semestre);
            set_alunos_str(turma_para_editar.alunos ? turma_para_editar.alunos.map(a => a.matricula_aluno).join(', ') : '');
        } else {
            set_nome('');
            set_semestre('');
            set_alunos_str('');
        }
    }, [turma_para_editar]);

    const handle_submit = (evento) => {
        evento.preventDefault();
        // Converte a string de matrículas (separadas por vírgula) em um array de números
        const matriculas_alunos = alunos_str
            .split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(n => !isNaN(n)); // Filtra valores que não são números

        on_submit({ nome, semestre, matriculas_alunos });
    };

    return (
        <form onSubmit={handle_submit} className="turma-form">
            <div className="form-group">
                <label htmlFor="nome">Nome da Turma</label>
                <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => set_nome(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="semestre">Semestre</label>
                <input
                    id="semestre"
                    type="text"
                    placeholder="Ex: 2025.2"
                    value={semestre}
                    onChange={(e) => set_semestre(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="alunos">Matrículas dos Alunos (separadas por vírgula)</label>
                <textarea
                    id="alunos"
                    value={alunos_str}
                    onChange={(e) => set_alunos_str(e.target.value)}
                    placeholder="Ex: 101, 102, 103"
                />
            </div>
            <div className="form-actions">
                <button type="button" onClick={on_cancel} className="btn-cancel">
                    Cancelar
                </button>
                <button type="submit" className="btn-submit">
                    Salvar
                </button>
            </div>
        </form>
    );
};

export default TurmaForm;