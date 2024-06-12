var database = require("../database/config");

function listarTotemStatus(empresa){

    var instrucaoSql = `
	SELECT
    e.idEmpresa AS ID_EMPRESA,
    a.nome AS NOME_AEROPORTO,
    tr.idTerminal AS TERMINAL,
    COUNT(t.idTotem) AS TOTAL_TOTENS,
    COUNT(CASE WHEN h.statusTotem = 'Inativo' THEN 1 END) AS TotensInativos,
    COUNT(CASE WHEN h.statusTotem = 'Manutenção' THEN 1 END) AS TotensEmManutencao,
    COUNT(CASE WHEN h.statusTotem = 'Ativo' THEN 1 END) AS TotensAtivos
FROM
    totem AS t
JOIN 
    terminal AS tr ON t.fk_Terminal = tr.idTerminal 
JOIN 
    empresa AS e ON tr.fk_empresa = e.idEmpresa 
JOIN 
    aeroporto AS a ON tr.fk_aeroporto = a.idAero 
LEFT JOIN
    HistoricoStatus as h ON h.fk_totem = t.idTotem AND h.fk_terminal = t.fk_terminal
WHERE 
    t.fk_empresa = '${empresa}'
GROUP BY
    e.idEmpresa, a.nome, tr.idTerminal;

`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}


function listarTerminalStatusManutencao(empresa){
	var instrucaoSql = `
	SELECT 
    e.idEmpresa,
    aero.nome,
    h.fk_Terminal,
    SUM(CASE 
            WHEN h.UsoProcessador >= a.metricaProcessadorRangeAlerta THEN 1 
            ELSE 0 
        END) AS totens_em_alerta,
    SUM(CASE 
            WHEN (h.UsoProcessador BETWEEN a.metricaProcessadorRangeLento AND a.metricaProcessadorRangeAlerta) THEN 1 
            ELSE 0 
        END) AS totens_lentos,
    SUM(CASE 
            WHEN h.UsoProcessador < a.metricaProcessadorRangeLento THEN 1 
            ELSE 0 
        END) AS totens_ok
FROM 
    (
        SELECT 
            fk_Totem,
            fk_Terminal,
            UsoProcessador,
            ROW_NUMBER() OVER (PARTITION BY fk_Totem ORDER BY idHistorico DESC) AS rn
        FROM 
            Historico
    ) AS h
JOIN 
    totem t ON h.fk_Totem = t.idTotem
JOIN
    aeroporto aero ON t.fk_aeroporto = aero.idAero
JOIN 
    empresa AS e ON t.fk_empresa = e.idEmpresa
JOIN
    terminal tr ON h.fk_Terminal = tr.idTerminal
JOIN 
    metrica a ON tr.fk_empresa = a.fk_empresa
WHERE
    e.idEmpresa = '${empresa}' AND h.rn = 1
GROUP BY
    e.idEmpresa,
    tr.idTerminal,
    aero.nome,
	h.fk_terminal;

`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function autenticar(terminal){
	
	var instrucaoSql = `

	SELECT 
    ter.idTerminal,
    COUNT(t.idTotem) as TotalTotens,
    SUM(CASE WHEN h.statusTotem = 'Inativo' THEN 1 ELSE 0 END) as TotensInativos,
    SUM(CASE WHEN h.statusTotem = 'Ativo' THEN 1 ELSE 0 END) AS TotensAtivos,
    SUM(CASE WHEN h.statusTotem = 'Manutenção' THEN 1 ELSE 0 END) AS TotensEmManutencao
FROM
    totem as t
JOIN 
    HistoricoStatus as h
ON
    h.fk_Totem = t.idTotem
JOIN 
    Terminal as ter 
ON 
    h.fk_Terminal = '${terminal}'
WHERE 
    ter.idTerminal = '${terminal}'
GROUP BY
    ter.idTerminal;

	`
	return database.executar(instrucaoSql);

}

function autenticarGerente(empresa){
		
	var instrucaoSql = `
	SELECT 
    t.fk_empresa,
    COUNT(t.idTotem) as Totaltotem
FROM 
    totem t
JOIN
    empresa e ON t.fk_empresa = e.idEmpresa
JOIN
    terminal tr ON t.fk_terminal = tr.idTerminal
WHERE
    e.idEmpresa = '${empresa}'
GROUP BY
    t.fk_empresa;

	`
	return database.executar(instrucaoSql);
}

function listarDadosKpis(empresa)
{

	var instrucaoSql = `SELECT 
    e.idEmpresa AS ID_EMPRESA,
    COUNT(t.idTotem) AS TOTAL_TOTENS_EMPRESA,
    COUNT(CASE WHEN h.statusTotem = 'Ativo' THEN 1 END) AS TOTAL_TOTENS_ATIVOS,
    COUNT(CASE WHEN h.statusTotem = 'Inativo' THEN 1 END) AS TOTAL_TOTENS_INATIVOS,
    COUNT(CASE WHEN h.statusTotem = 'Manutenção' THEN 1 END) AS TOTAL_TOTENS_MANU
FROM 
    totem t
JOIN 
    empresa e ON t.fk_empresa = e.idEmpresa
JOIN 
    HistoricoStatus h ON h.fk_totem = t.idTotem
WHERE 
    e.idEmpresa = '${empresa}'
GROUP BY 
    e.idEmpresa;
`

	return database.executar(instrucaoSql);
}

module.exports = {
    listarTotemStatus,
	listarTerminalStatusManutencao,
	autenticarGerente,
	listarDadosKpis,
	autenticar
};