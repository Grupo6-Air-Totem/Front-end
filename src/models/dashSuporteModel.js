var database = require("../database/config");

function listarTotemStatus(idTerminal,empresa){

    var instrucaoSql = `
    SELECT 
	t.fk_Empresa as FK_EMPRESA,
    t.fk_terminal as FK_TERMINAL,
    t.fk_aeroporto as FK_AEROPORTO,
    t.nomeTotem as NOME_TOTEM,
    t.idTotem as ID_TOTEM,
    h.usoProcessador as USO_PROCESSADOR,
    hd.porcentDisponivel as DISCO_DISPONIVEL,
	h.UsoMemoria as USO_MEMORIA,
    h.velocidadeRede as VELOCIDADE_REDE,
    hs.statusTotem as STATUS_TOTEM
    from totem as t
    join empresa as e on t.fk_empresa = e.idEmpresa
    join aeroporto as a on t.fk_aeroporto = a.idAero
    join terminal as ter on t.fk_terminal = ter.idTerminal
    join Historico as h on h.fk_totem = t.idTotem
    join HistoricoDisco as hd on hd.fk_totem = t.idTotem
    join HistoricoStatus as hs on hs.fk_totem = t.idTotem
    where hs.statusTotem = "Ativo" and e.idEmpresa = '${empresa}' and t.fk_terminal = '${idTerminal}';
`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function listarStatusManutencao(idTerminal, idEmpresa){
	var instrucaoSql = `
    select 
    t.fk_empresa as FK_EMPRESA,
    t.fk_terminal as FK_TERMINAL,
    t.fk_aeroporto as FK_AEROPORTO,
    t.idTotem as ID_TOTEM,
    t.nomeTotem as NOME_TOTEM,
    DATE_FORMAT(hs.colocadoManutencao, '%d/%m/%Y') as ENTRADA_MANU,
    hs.statusTotem as STATUS_TOTEM
from totem as t
join empresa as e on t.fk_empresa = e.idEmpresa
join aeroporto as a on t.fk_aeroporto = a.idAero
join terminal as ter on t.fk_terminal = ter.idTerminal
join HistoricoStatus as hs on hs.fk_totem = t.idTotem
where (hs.statusTotem = "Manutenção" or hs.statusTotem = "Inativo") and e.idEmpresa = '${idEmpresa}' and t.fk_terminal = '${idTerminal}';`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
}

function listarDadosKpis(empresa,terminal){
	var instrucaoSql = `
	select e.idEmpresa, ter.idTerminal, Count(t.idTotem) as TOTAL_TOTENS,
	COUNT(CASE WHEN h.statusTotem = 'Inativo' then 1 end) as TOTAL_TOTENS_INATIVOS,
    COUNT(CASE WHEN h.statusTotem = 'Manutenção' THEN 1 END) AS TOTAL_TOTENS_MANU,
	COUNT(CASE WHEN h.statusTotem = 'Ativo' THEN 1 END) AS TOTAL_TOTENS_ATIVOS from totem as t join terminal as ter 
on t.fk_Terminal = ter.idTerminal join empresa as e on
t.fk_empresa = e.idEmpresa join aeroporto as a
on t.fk_aeroporto = a.idAero
join historicostatus as h
on h.fk_totem = t.idTotem
where e.idEmpresa = '${empresa}' and ter.idTerminal = '${terminal}'
group by
	ter.idTerminal;`

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
e.idEmpresa = '${idEmpresa}' and t.fk_terminal = '${idTerminal}'
group by
e.idEmpresa,
tr.idTerminal,
aero.nome;
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
        THEN 1 ELSE 0 END) AS totens_em_alerta,
SUM(CASE 
        WHEN (h.usoMemoria BETWEEN a. metricaMemoriaRangeLento AND a.metricaMemoriaRangeAlerta) 
        THEN 1 ELSE 0 END) AS totens_lentos,
SUM(CASE 
        WHEN h.usoMemoria < a. metricaMemoriaRangeLento 
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
e.idEmpresa = '${idEmpresa}' and t.fk_terminal = '${idTerminal}'
group by
e.idEmpresa,
tr.idTerminal,
aero.nome;;
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
        WHEN h.velocidadeRede >= a.velocidadeMbpsRedeRangeAlerta
        THEN 1 ELSE 0 END) AS totens_em_alerta,
SUM(CASE 
        WHEN (h.velocidadeRede BETWEEN a. velocidadeMbpsRedeRangeLento AND a.velocidadeMbpsRedeRangeAlerta) 
        THEN 1 ELSE 0 END) AS totens_lentos,
SUM(CASE 
        WHEN h.velocidadeRede < a. velocidadeMbpsRedeRangeLento 
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
e.idEmpresa = '${idEmpresa}' and t.fk_terminal = '${idTerminal}'
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
    COUNT(t.idTotem) as TotalTotens
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

function autenticarTotem(totem,idEmpresa,idTerminal){
    var instrucaoSql = `select 
	t.idTotem as ID_TOTEM,
    t.nomeTotem as NOME_TOTEM,
    e.nome as NOME_EMPRESA,
    t.tempo_atv as TEMPO_ATIVIDADE,
    t.modeloProcessador as MODELO_PROCESSADOR,
    t.so as SISTEMA_OPERACIONAL,
    t.memoriaTotal as MEMORIA_RAM,
    t.hostRede as HOST_REDE
FROM totem as t
join empresa as e
on t.fk_empresa = e.idEmpresa
join terminal as ter
on t.fk_terminal = ter.idTerminal
where t.fk_empresa = '${idEmpresa}' and ter.idTerminal = '${idTerminal}' and t.idTotem = '${totem}';`

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