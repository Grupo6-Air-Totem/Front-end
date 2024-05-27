var database = require("../database/config");

function listarTotemStatus(){

    var instrucaoSql = `
    select 
	ter.idTerminal,
    COUNT(t.idTotem) as TotalTotens,
	COUNT(CASE WHEN h.statusTotem = 'Inativo' then 1 end) as TotensInativos,
    COUNT(CASE WHEN h.statusTotem = 'Manutenção' THEN 1 END) AS TotensEmManutencao,
	COUNT(CASE WHEN h.statusTotem = 'Ativo' THEN 1 END) AS TotensAtivos
from
	totem as t
join 
	HistoricoStatus as h
on
	h.fk_Totem = t.idTotem
join 
	Terminal as ter
on 
	h.fk_Terminal = ter.idTerminal
group by
	ter.idTerminal; 
`
console.log("Executando a instrução SQL: \n" + instrucaoSql);
return database.executar(instrucaoSql);
    
}
module.exports = {
    listarTotemStatus
};