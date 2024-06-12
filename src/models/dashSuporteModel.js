var database = require("../database/config");

function listarTotemStatus(idTerminal,empresa){

    var instrucaoSql = `
    SELECT 
    t.fk_Empresa AS FK_EMPRESA,
    t.fk_terminal AS FK_TERMINAL,
    t.fk_aeroporto AS FK_AEROPORTO,
    t.idTotem AS ID_TOTEM,
    h.idHIstorico,
    h.usoProcessador AS USO_PROCESSADOR,
    hd.porcentDisponivel AS DISCO_DISPONIVEL,
    h.UsoMemoria AS USO_MEMORIA,
    h.velocidadeRede AS VELOCIDADE_REDE,
    hs.statusTotem AS STATUS_TOTEM
FROM 
    totem AS t
JOIN 
    empresa AS e ON t.fk_empresa = e.idEmpresa
JOIN 
    aeroporto AS a ON t.fk_aeroporto = a.idAero
JOIN 
    terminal AS ter ON t.fk_terminal = ter.idTerminal
JOIN 
    Historico AS h ON h.fk_totem = t.idTotem
JOIN 
    (
        SELECT 
            fk_totem, MAX(porcentDisponivel) AS porcentDisponivel
        FROM 
            HistoricoDisco
        GROUP BY 
            fk_totem
    ) AS hd ON hd.fk_totem = t.idTotem
JOIN 
    (
        SELECT 
            fk_totem, statusTotem
        FROM 
            HistoricoStatus
        WHERE 
            diaHorario IN (SELECT MAX(diaHorario) FROM HistoricoStatus GROUP BY fk_totem)
    ) AS hs ON hs.fk_totem = t.idTotem
WHERE 
    hs.statusTotem = 'Ativo' AND e.idEmpresa = '${empresa}' AND t.fk_terminal = '${idTerminal}'
AND
    EXISTS (
        SELECT 1
        FROM (
            SELECT 
                t.idTotem,
                MAX(h.idHistorico) AS max_idHistorico
            FROM 
                totem AS t
            JOIN 
                Historico AS h ON h.fk_totem = t.idTotem
            GROUP BY 
                t.idTotem
        ) AS sub
        WHERE 
            sub.idTotem = t.idTotem AND sub.max_idHistorico = h.idHistorico
    );


`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function listarStatusManutencao(idTerminal, idEmpresa){
	var instrucaoSql = `
    SELECT 
    t.fk_empresa AS FK_EMPRESA,
    t.fk_terminal AS FK_TERMINAL,
    t.fk_aeroporto AS FK_AEROPORTO,
    t.idTotem AS ID_TOTEM,
    CONVERT(varchar, hs.colocadoManutencao, 103) AS ENTRADA_MANU,
    hs.statusTotem AS STATUS_TOTEM
FROM 
    totem AS t
JOIN 
    empresa AS e ON t.fk_empresa = e.idEmpresa
JOIN 
    aeroporto AS a ON t.fk_aeroporto = a.idAero
JOIN 
    terminal AS ter ON t.fk_terminal = ter.idTerminal
JOIN 
    HistoricoStatus AS hs ON hs.fk_totem = t.idTotem
WHERE 
    (hs.statusTotem = 'Manutenção' OR hs.statusTotem = 'Inativo') AND e.idEmpresa = '${idEmpresa}' AND t.fk_terminal = '${idTerminal}';
`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function listarDadosKpis(empresa,terminal){
	var instrucaoSql = `
	SELECT 
    e.idEmpresa,
    ter.idTerminal,
    COUNT(t.idTotem) AS TOTAL_TOTENS,
    SUM(CASE WHEN h.statusTotem = 'Inativo' THEN 1 ELSE 0 END) AS TOTAL_TOTENS_INATIVOS,
    SUM(CASE WHEN h.statusTotem = 'Manutenção' THEN 1 ELSE 0 END) AS TOTAL_TOTENS_MANU,
    SUM(CASE WHEN h.statusTotem = 'Ativo' THEN 1 ELSE 0 END) AS TOTAL_TOTENS_ATIVOS 
FROM 
    totem AS t 
JOIN 
    terminal AS ter ON t.fk_Terminal = ter.idTerminal 
JOIN 
    empresa AS e ON t.fk_empresa = e.idEmpresa 
JOIN 
    aeroporto AS a ON t.fk_aeroporto = a.idAero 
JOIN 
    historicostatus AS h ON h.fk_totem = t.idTotem 
WHERE 
    e.idEmpresa = '${empresa}' AND ter.idTerminal = '${terminal}'
GROUP BY
    e.idEmpresa, ter.idTerminal;
`

console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);

}
function listarDadosCPU(idTerminal,idEmpresa){
	var instrucaoSql = `
SELECT 
    e.idEmpresa,
    aero.nome,
    h.fk_Terminal,
    SUM(CASE 
            WHEN h.UsoProcessador >= a.metricaProcessadorRangeAlerta 
            THEN 1 ELSE 0 END) AS totens_em_alerta,
    SUM(CASE 
            WHEN (h.UsoProcessador BETWEEN a.metricaProcessadorRangeLento AND a.metricaProcessadorRangeAlerta) 
            THEN 1 ELSE 0 END) AS totens_lentos,
    SUM(CASE 
            WHEN h.UsoProcessador < a.metricaProcessadorRangeLento 
            THEN 1 ELSE 0 END) AS totens_ok
FROM 
    (SELECT * FROM Historico h1
     WHERE h1.idHistorico = (SELECT MAX(h2.idHistorico) 
                             FROM Historico h2 
                             WHERE h2.fk_Totem = h1.fk_Totem)) AS h
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
WHERE
    e.idEmpresa = 2 AND t.fk_terminal = 2
GROUP BY
    e.idEmpresa,
    tr.idTerminal,
    aero.nome,
    h.fk_Terminal;

`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);


}

function listarDadosMemoria(idTerminal,idEmpresa){
	var instrucaoSql = `
 SELECT 
    e.idEmpresa,
    aero.nome,
    h.fk_Terminal,
    SUM(CASE 
            WHEN h.usoMemoria >= a.metricaMemoriaRangeAlerta 
            THEN 1 ELSE 0 
        END) AS totens_em_alerta,
    SUM(CASE 
            WHEN h.usoMemoria BETWEEN a.metricaMemoriaRangeLento AND a.metricaMemoriaRangeAlerta 
            THEN 1 ELSE 0 
        END) AS totens_lentos,
    SUM(CASE 
            WHEN h.usoMemoria < a.metricaMemoriaRangeLento 
            THEN 1 ELSE 0 
        END) AS totens_ok
FROM 
    (SELECT h1.*
     FROM Historico h1
     INNER JOIN (SELECT fk_Totem, MAX(idHistorico) AS maxIdHistorico
                 FROM Historico
                 GROUP BY fk_Totem) h2
     ON h1.fk_Totem = h2.fk_Totem AND h1.idHistorico = h2.maxIdHistorico) h
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
WHERE
    e.idEmpresa = '${idEmpresa}' AND t.fk_terminal = '${idTerminal}'
GROUP BY
    e.idEmpresa,
    h.fk_Terminal,
    aero.nome;
`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function listarDadosRede(idTerminal,idEmpresa){
	var instrucaoSql = `
    SELECT 
    e.idEmpresa,
    aero.nome,
    h.fk_Terminal,
    SUM(CASE 
            WHEN h.velocidadeRede >= a.velocidadeMbpsRedeRangeAlerta THEN 1
            ELSE 0 
        END) AS totens_em_alerta,
    SUM(CASE 
            WHEN h.velocidadeRede BETWEEN a.velocidadeMbpsRedeRangeLento AND a.velocidadeMbpsRedeRangeAlerta THEN 1
            ELSE 0 
        END) AS totens_lentos,
    SUM(CASE 
            WHEN h.velocidadeRede < a.velocidadeMbpsRedeRangeLento THEN 1
            ELSE 0 
        END) AS totens_ok
FROM 
    (SELECT h1.*
     FROM Historico h1
     INNER JOIN (SELECT fk_Totem, MAX(idHistorico) AS maxIdHistorico
                 FROM Historico
                 GROUP BY fk_Totem) h2
     ON h1.fk_Totem = h2.fk_Totem AND h1.idHistorico = h2.maxIdHistorico) h
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
WHERE
    e.idEmpresa = '${idEmpresa}' AND t.fk_terminal = '${idTerminal}'
GROUP BY
    e.idEmpresa,
    tr.idTerminal,
    aero.nome,
    h.fk_Terminal;


`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function autenticar(terminal){
	
	var instrucaoSql = `

	SELECT 
    ter.idTerminal,
    COUNT(t.idTotem) as TotalTotens
FROM
    totem as t
JOIN 
    HistoricoStatus as h ON h.fk_Totem = t.idTotem
JOIN 
    Terminal as ter ON h.fk_Terminal = ter.idTerminal
WHERE 
    ter.idTerminal = '${terminal}'
GROUP BY
    ter.idTerminal;

	`
	return database.executar(instrucaoSql);

}

function autenticarTotem(totem,idEmpresa,idTerminal){
    var instrucaoSql = `
    SELECT 
    t.idTotem AS ID_TOTEM,
    e.nome AS NOME_EMPRESA,
    t.tempo_atv AS TEMPO_ATIVIDADE,
    t.modeloProcessador AS MODELO_PROCESSADOR,
    t.so AS SISTEMA_OPERACIONAL,
    t.memoriaTotal AS MEMORIA_RAM,
    t.hostRede AS HOST_REDE
FROM 
    totem AS t
JOIN 
    empresa AS e ON t.fk_empresa = e.idEmpresa
JOIN 
    terminal AS ter ON t.fk_terminal = ter.idTerminal
WHERE 
    t.fk_empresa = '${idEmpresa}' AND ter.idTerminal = '${idTerminal}' AND t.idTotem = '${totem}';

`

return database.executar(instrucaoSql);

}

module.exports = {
    listarTotemStatus,
	listarStatusManutencao,
	listarDadosCPU,
    autenticarTotem,
	listarDadosMemoria,
    listarDadosKpis,
	listarDadosRede,
	autenticar
};