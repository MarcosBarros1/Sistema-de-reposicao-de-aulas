// model/Notificacao.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho se necessário

const Notificacao = sequelize.define('Notificacao', {
    // O ID da notificação, que é a chave primária
    id_notificacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_notificacao' // Garante que o nome da coluna no DB é o correto
    },

    // ID do usuário que receberá a notificação (chave estrangeira)
    id_destinatario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario', // Nome da tabela referenciada
            key: 'id_usuario' // Nome da coluna referenciada
        },
        field: 'id_destinatario'
    },

    // O conteúdo da mensagem da notificação
    mensagem: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    // A data em que a notificação foi criada/enviada
    data_envio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    // Um booleano para indicar se a notificação já foi lida
    lida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    // Configurações adicionais do modelo
    tableName: 'notificacao', // Especifica o nome exato da tabela no banco
    timestamps: false // Desativa os campos createdAt e updatedAt automáticos do Sequelize
});

// Definindo o relacionamento (associação)
// Isso permite usar funções como `notificacao.getUsuario()`
Notificacao.associate = (models) => {
    Notificacao.belongsTo(models.Usuario, {
        foreignKey: 'id_destinatario',
        as: 'destinatario' // Um "apelido" para a associação
    });
};


module.exports = Notificacao;