var database = require("../database/config");
const { TYPES } = require('mssql');


function listarDadosKPI(totem) {
    var instrucaoSQL = `
        SELECT 
            e.idEmpresa,
            aero.nome AS AEROPORTO,
            h.fk_Terminal AS FK_TERMINAL,
            t.idTotem AS idTotem,
            hd.porcentDisponivel as DISCO_DISPONIVEL,
            CASE 
                WHEN h.velocidadeRede < a.velocidadeMbpsRedeRangeLento THEN 'OK'
                WHEN h.velocidadeRede >= a.velocidadeMbpsRedeRangeAlerta THEN 'ALERTA'
                ELSE 'LENTO'
            END AS status_rede, h.velocidadeRede as VELOCIDADE_REDE,
            CASE 
                WHEN h.usoMemoria < a.metricaMemoriaRangeLento THEN 'OK'
                WHEN h.usoMemoria >= a.metricaMemoriaRangeAlerta THEN 'ALERTA'
                ELSE 'LENTO'
            END AS status_memoria, h.usoMemoria as USO_MEMORIA,
            CASE 
                WHEN h.UsoProcessador < a.metricaProcessadorRangeLento THEN 'OK'
                WHEN h.UsoProcessador >= a.metricaProcessadorRangeAlerta THEN 'ALERTA'
                ELSE 'LENTO'
            END AS status_cpu, h.usoProcessador as USO_PROCESSADOR,
            CASE 
                WHEN h.velocidadeRede < a.velocidadeMbpsRedeRangeLento 
                     AND h.usoMemoria < a.metricaMemoriaRangeLento 
                     AND h.UsoProcessador < a.metricaProcessadorRangeLento
                THEN 'OK'
                WHEN h.velocidadeRede >= a.velocidadeMbpsRedeRangeAlerta 
                     OR h.usoMemoria >= a.metricaMemoriaRangeAlerta 
                     OR h.UsoProcessador >= a.metricaProcessadorRangeAlerta
                THEN 'ALERTA'
                ELSE 'LENTO'
            END AS status_geral
        FROM 
            Historico h
        JOIN 
            totem t ON h.fk_Totem = t.idTotem
        JOIN
            aeroporto aero ON t.fk_aeroporto = aero.idAero
        JOIN 
            empresa e ON t.fk_empresa = e.idEmpresa
        JOIN
            terminal tr ON h.fk_Terminal = tr.idTerminal
        JOIN 
            metrica a ON tr.fk_empresa = a.fk_empresa
        JOIN
            HistoricoDisco as hd ON hd.fk_totem = t.idTotem
        WHERE
            h.fk_Totem = '${totem}'
        GROUP BY
            e.idEmpresa,
            aero.nome,
            h.fk_Terminal,
            t.idTotem,
            h.velocidadeRede,
            h.usoMemoria,
            h.UsoProcessador,
            a.velocidadeMbpsRedeRangeLento,
            a.velocidadeMbpsRedeRangeAlerta,
            a.metricaMemoriaRangeLento,
            a.metricaMemoriaRangeAlerta,
            a.metricaProcessadorRangeLento,
            a.metricaProcessadorRangeAlerta,
            hd.porcentDisponivel;
    `;
    
    return database.executar(instrucaoSQL);
}

function verificarStatusManutencao(idTotem) {
    var instrucaoSQL = `
        SELECT * FROM historicoStatus WHERE fk_totem = '${idTotem}';
    `;
    return database.executar(instrucaoSQL);
}

function inserirStatusManutencao(idTotem, novoStatus, campoData) {
    var instrucaoSQL = `
        INSERT INTO historicoStatus (fk_totem, statusTotem, ${campoData})
        VALUES ('${idTotem}', '${novoStatus}', '${campoData}');
    `;
    
    return database.executar(instrucaoSQL);
}

function atualizarStatusManutencao(idTotem, novoStatus, campoData) {
    let campoDataQuery = '';
    if (campoData.colocadoManutencao) {
        campoDataQuery = `colocadoManutencao='${campoData.colocadoManutencao}'`;
    } else if (campoData.retiradoManutencao) {
        campoDataQuery = `retiradoManutencao='${campoData.retiradoManutencao}'`;
    }

    var instrucaoSQL = `
        UPDATE historicoStatus
        SET statusTotem = '${novoStatus}', ${campoDataQuery}
        WHERE fk_totem = '${idTotem}'`;
    
    return database.executar(instrucaoSQL);
}

function listarDadosCPU(idTotem,idEmpresa){
    var instrucaoSQL = `SELECT TOP 1 h.idHistorico as ID_HISTORICO, h.usoProcessador as USO_CPU, e.idEmpresa 
FROM totem as t 
JOIN historico as h ON h.fk_totem = t.idTotem 
JOIN empresa as e ON t.fk_empresa = e.idEmpresa 
WHERE t.idTotem = '${idTotem}'
  AND e.idEmpresa = '${idEmpresa}'
ORDER BY h.idHistorico DESC;` 

return database.executar(instrucaoSQL);
}



function atualizarStatusAtivo(idTotem, novoStatus, campoData) {
    var instrucaoSQL = `
        UPDATE historicoStatus
        SET statusTotem = '${novoStatus}', ${campoData}
        WHERE fk_totem = '${idTotem}';
    `;
    
    return database.executar(instrucaoSQL);
}

module.exports = {
    listarDadosKPI,
    verificarStatusManutencao,
    inserirStatusManutencao,
    atualizarStatusManutencao,
    listarDadosCPU,
    atualizarStatusAtivo
};
