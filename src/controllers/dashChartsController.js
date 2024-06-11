var dashChartsModel = require("../models/dashChartsModel");

  function listarDadosKPI(req,res){
    var totem = req.params.idTotem;
    console.log("TOTEM: " + totem);
    if(totem == undefined){
      console.log("TOTEM UNDEFINED!");
    }else{
      dashChartsModel
      .listarDadosKPI(totem)
      .then(function (resultado){
        console.log(`\n Resultados encontrado: ${resultado.length}`);
        console.log(`Resultado: ${JSON.stringify(resultado)}`);

        if(resultado.length > 0){
          res.status(200).json(resultado);
        }else if(resultado == 0){
          res.status(403).send("Totem não existe, ou não foi encontrado");
        }
      }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao encontrar o totem: " + erro.sqlMessage)
        res.status(500).json(erro.sqlMessage);
      });
    }
  }

  function atualizarStatusManutencao(req,res){
    const idTotem = req.params.idTotem;
    const { acao } = req.body;
    console.log("ID TOTEM: " + idTotem);
    let novoStatus;
    debugger
    if(acao == "remover"){
      console.log("CHEGOU AQUI!!");
      novoStatus = 'Ativo';
      dashChartsModel.atualizarStatusAtivo(idTotem,novoStatus)
      .then(()=>{
        res.json({message: 'Status atualizado com sucesso'});
      })
      .catch(error => {
        console.error('Erro ao atualizar status no banco de dados: ', error);
        res.status(500).json({message: 'Erro ao atualizar status'})
      })
    }else if(acao == "adicionar"){
      novoStatus = 'Manutenção';
      dashChartsModel.atualizarStatusManutencao(idTotem, novoStatus)
      .then(()=>{
        res.json({message: 'Status atualizado com sucesso'});
      })
      .catch(error => {
        console.error('Erro ao atualizar status no banco de dados: ', error);
        res.status(500).json({message: 'Erro ao atualizar status'});
      });
    }
  }

module.exports = {
  listarDadosKPI,atualizarStatusManutencao
  };