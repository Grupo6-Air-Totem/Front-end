var dashGeralModel = require("../models/dashGeralModel");

function listarTerminalStatus(req, res) {
  var empresa = req.params.idEmpresa;
  dashGeralModel
    .listarTotemStatus(empresa)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
        // res.json(resultado);
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function listarTerminalStatusManutencao(req,res){
  var empresa = req.params.idEmpresa
  dashGeralModel
  .listarTerminalStatusManutencao(empresa)
  .then(function (resultado) {
    if (resultado.length > 0) {
      res.status(200).json(resultado);
      // res.json(resultado);
    }
  })
  .catch(function (erro) {
    console.log(erro);
    res.status(500).json(erro.sqlMessage);
  });
}

function autenticar(req, res) {
  var terminal = req.body.idTerminalServer;
  if (terminal == undefined) {
    res.status(400).send("Seu terminal está undefined!");
  } else {
    dashGeralModel
      .autenticar(terminal)
      .then(function (resultadoAutenticar) {
        console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
        console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

        if (resultadoAutenticar.length == 1) {
          console.log(resultadoAutenticar);
          res.status(200).json(resultadoAutenticar);
        } else if (resultadoAutenticar == 0) {
          res.status(403).send("Terminal não existe");
        }
      })
      .catch(function (erro) {
        console.log(erro);
        console.log(
          "\nHouve um erro ao encontrar o terminal: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function autenticarGerente(req,res){
  var empresa = req.body.idEmpresaServer;
  dashGeralModel
  .autenticarGerente(empresa)
  .then(function (resultadoAutenticar) {
    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

    if (resultadoAutenticar.length == 1) {
      console.log(resultadoAutenticar);
      res.status(200).json(resultadoAutenticar);
    } else if (resultadoAutenticar == 0) {
      res.status(403).send("Terminal não existe");
    }
  })
  .catch(function (erro) {
    console.log(erro);
    console.log(
      "\nHouve um erro ao encontrar o terminal: ",
      erro.sqlMessage
    );
    res.status(500).json(erro.sqlMessage);
  });
}

function listarDadosKpis(req,res){
  
  var empresa = req.params.idEmpresa;
  if(empresa == undefined){
    console.log("empresa está undefined");
  }else{
    dashGeralModel
      .listarDadosKpis(empresa)
      .then(function (resultado){
        console.log("\n Resultados encontrados: ", resultado.length);
        console.log(`Resultados: ${JSON.stringify(resultado)}`);

        if(resultado.length > 0){
          res.status(200).json(resultado);
        }else if(resultado == 0)
          res.status(403).send("Terminal ou empresa não exite");
          
        
      }).catch(function (erro){ 
        console.log(erro);
        console.log(`
        \n Houve um erro ao encontrar o terminal ou empresa:
        ${erro.sqlMessage}`);
        res.status(500).json(erro.sqlMessage);
      });
  }
}


module.exports = {
  listarTerminalStatus,
  listarTerminalStatusManutencao,
  autenticarGerente,
  listarDadosKpis,
  autenticar
};
