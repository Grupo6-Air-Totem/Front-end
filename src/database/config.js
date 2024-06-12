const sql = require("mssql");

// Configuração para conexão ao SQL Server
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true, // Se você estiver usando conexão criptografada
        trustServerCertificate: true // Para confiar em certificados autoassinados
    }
};

async function executar(instrucao) {
    try {
        await sql.connect(sqlConfig);
        const resultado = await sql.query(instrucao);
        console.log(resultado.recordset);
        return resultado.recordset;
    } catch (error) {
        console.error("Erro na execução da instrução:", error);
        throw error;
    } finally {
        sql.close();
    }
}

module.exports = {
    executar
};
