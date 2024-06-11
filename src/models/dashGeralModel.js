var database = require("../database/config");

function listarTotemStatus(empresa){

    var instrucaoSql = `
	SELECT
	e.idEmpresa AS ID_EMPRESA,
    a.nome AS NOME_AEROPORTO,
    tr.idTerminal AS TERMINAL,
	COUNT(t.idTotem) AS TOTAL_TOTENS,
    COUNT(CASE WHEN h.statusTotem = 'Inativo' then 1 end) as TotensInativos,
    COUNT(CASE WHEN h.statusTotem = 'Manutenção' THEN 1 END) AS TotensEmManutencao,
	COUNT(CASE WHEN h.statusTotem = 'Ativo' THEN 1 END) AS TotensAtivos
FROM
	totem AS t
JOIN 
	terminal AS tr 
ON
	t.fk_Terminal = tr.idTerminal 
JOIN 
	empresa AS e 
ON 
    tr.fk_empresa = e.idEmpresa 
JOIN 
	aeroporto AS a 
on 
	tr.fk_aeroporto = a.idAero 
JOIN
	HistoricoStatus as h
on
	h.fk_totem = t.idTotem and h.fk_terminal = t.fk_terminal
WHERE 
	t.fk_empresa = '${empresa}'
GROUP BY
	e.idEmpresa,a.nome, tr.idTerminal;
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
		WHEN h.UsoProcessador >= a.metricaProcessadorRangeAlerta 
		THEN 1 ELSE 0 END) AS totens_em_alerta,
SUM(CASE 
		WHEN (h.UsoProcessador BETWEEN a.metricaProcessadorRangeLento AND a.metricaProcessadorRangeAlerta) 
		THEN 1 ELSE 0 END) AS totens_lentos,
SUM(CASE 
		WHEN h.UsoProcessador < a.metricaProcessadorRangeLento 
		THEN 1 ELSE 0 END) AS totens_ok
FROM 
Historico h
JOIN 
totem t ON h.fk_Totem = t.idTotem
JOIN
aeroporto aero on t.fk_aeroporto = aero.idAero
JOIN 
empresa as e on t.fk_empresa = e.idEmpresa
JOIN
terminal tr ON h.fk_Terminal = tr.idTerminal
JOIN 
metrica a ON tr.fk_empresa = a.fk_empresa
where
e.idEmpresa = '${empresa}'
group by
e.idEmpresa,
tr.idTerminal,
aero.nome;
`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function autenticar(terminal){
	
	var instrucaoSql = `

	select 
	ter.idTerminal,
    COUNT(t.idTotem) as TotalTotens,
	COUNT(CASE WHEN h.statusTotem = 'Inativo' then 1 end) as TotensInativos,
	COUNT(CASE WHEN h.statusTotem = 'Ativo' THEN 1 END) AS TotensAtivos,
	COUNT(CASE WHEN h.statusTotem = 'Manutenção' THEN 1 END) AS TotensEmManutencao
from
	totem as t
join 
	HistoricoStatus as h
on
	h.fk_Totem = t.idTotem
join 
	Terminal as ter
on 
	h.fk_Terminal = '${terminal}'
where 
	ter.idTerminal = '${terminal}'
group by
	ter.idTerminal;
	`
	return database.executar(instrucaoSql);

}

function autenticarGerente(empresa){
		
	var instrucaoSql = `
	select 
	t.fk_empresa,
	Count(t.idTotem) as Totaltotem
from 
   totem 
as 	t
join
   empresa as e
on t.fk_empresa = e.idEmpresa
join
   terminal as tr
on t.fk_terminal = tr.idTerminal
where
   e.idEmpresa = '${empresa}';
	`
	return database.executar(instrucaoSql);
}

function listarDadosKpis(empresa)
{

	var instrucaoSql = `select e.idEmpresa as ID_EMPRESA, count(t.idTotem) as TOTAL_TOTENS_EMPRESA,
	count(case when h.statusTotem = 'Ativo' then 1 end) as TOTAL_TOTENS_ATIVOS,
	count(case when h.statusTotem = 'Inativo' then 1 end) as TOTAL_TOTENS_INATIVOS,
	count(case when h.statusTotem = 'Manutenção' then 1 end) as TOTAL_TOTENS_MANU
	from totem as t
	join empresa as e 
	on t.fk_empresa = e.idEmpresa
	join HistoricoStatus as h
	on h.fk_totem = t.idTotem
	where e.idEmpresa = '${empresa}';`

	return database.executar(instrucaoSql);
}

module.exports = {
    listarTotemStatus,
	listarTerminalStatusManutencao,
	autenticarGerente,
	listarDadosKpis,
	autenticar
};