var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha);
    
    var instrucaoSql = `
        SELECT 
        u.idUser AS idUser,
        u.nome AS nomeUsuario,
        e.nome AS nomeEmpresa,
        u.email AS email, 
        u.fk_empresa AS empresaId, 
        u.nivelAcesso AS nivelAcesso,
        u.fk_aeroporto AS aeroId -- Adicionando o id do aeroporto
    FROM 
        usuario AS u 
    JOIN 
        empresa AS e 
    ON 
        u.fk_empresa = e.idEmpresa 
    WHERE 
        u.email = '${email}' 
    AND 
        u.senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listar(empresaId, aeroportoId) {
    var instrucaoSql = `
        SELECT 
            u.idUser AS idUser,
            u.nome AS nomeUsuario,
            e.nome AS nomeEmpresa,
            u.nivelAcesso AS nivelAcesso
        FROM 
            usuario AS u 
        JOIN 
            empresa AS e 
        ON 
            u.fk_empresa = e.idEmpresa
        WHERE 
            u.fk_empresa = ${empresaId} AND u.fk_aeroporto = ${aeroportoId};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}




function deletar(idUser) {
    var instrucaoSql = `DELETE FROM usuario WHERE idUser = ${idUser}`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrar(nome, sobrenome, email, cpf, celular, nivelAcesso, empresaId, aeroportoId) {
    console.log("ACESSEI O USUARIO MODEL: function cadastrar()");

    var instrucaoSql = `
        INSERT INTO usuario (nome, sobrenome, email, cpf, celular, nivelAcesso, fk_empresa, fk_aeroporto)
        VALUES ('${nome}', '${sobrenome}', '${email}', '${cpf}', '${celular}', '${nivelAcesso}', '${empresaId}', '${aeroportoId}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    listar,
    deletar,
    cadastrar
};