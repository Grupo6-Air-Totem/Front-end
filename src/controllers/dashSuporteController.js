var dashSuporteModel = require("../models/dashSuporteModel");

function listarTotemStatus(req, res) {
  var empresa = req.params.idEmpresa;
  var idTerminal = req.params.idTerminal;
  console.log("CHEGUEI CONTROLLER");
    dashSuporteModel
    .listarTotemStatus(idTerminal,empresa)
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

function listarStatusManutencao(req, res) {
  var idEmpresa = req.params.idEmpresa;
  var idTerminal = req.params.idTerminal;
  console.log("CHEGUEI CONTROLLER");
    dashSuporteModel
    .listarStatusManutencao(idTerminal,idEmpresa)
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

function listarDadosCPU(req,res){
  var idEmpresa = req.params.idEmpresa;
  var idTerminal = req.params.idTerminal;
  console.log("CHEGUEI CONTROLLER");
    dashSuporteModel
    .listarDadosCPU(idTerminal,idEmpresa)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
        // res.json(resultado);
        console.log("CHEGOU CONTROLLER");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}


function listarDadosKpis(req,res){
  
  var terminal = req.params.idTerminal
  var empresa = req.params.idEmpresa;
  console.log(terminal);
  console.log("listar KPI",terminal);
  if(terminal == undefined || empresa == undefined){
    console.log("Terminal ou empresa está undefined");
  }else{
    dashSuporteModel
      .listarDadosKpis(empresa,terminal)
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

function listarDadosMemoria(req,res){
  var idTerminal = req.params.idTerminal;
  var idEmpresa = req.params.idEmpresa;
  console.log("CHEGUEI CONTROLLER");
    dashSuporteModel
    .listarDadosMemoria(idTerminal,idEmpresa)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
        // res.json(resultado);
        console.log("CHEGOU CONTROLLER");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function listarDadosRede(req,res){
  var idTerminal = req.params.idTerminal;
  var idEmpresa = req.params.idEmpresa;
  console.log("CHEGUEI CONTROLLER");
    dashSuporteModel
    .listarDadosRede(idTerminal,idEmpresa)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
        // res.json(resultado);
        console.log("CHEGOU CONTROLLER");
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
    dashSuporteModel
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

function autenticarTotem(req,res){
  var totem = req.body.idTotemServer;
  var empresa = req.body.idEmpresaServer;
  var terminal = req.body.idTerminalServer;
  if(totem == undefined){
    res.status(400).send("TOTEM ESTÁ UNDEFINED")
  }else if(empresa == undefined){
    res.status(400).send("EMPRESA ESTÁ UNDEFINED");
  }else if(terminal == undefined){
    res.status(400).send("TERMINAL ESTÁ UNDEFINED");
  }else{
    console.log("CHEGOU NO CONTROLLERR")
    dashSuporteModel.
    autenticarTotem(totem,empresa,terminal)
    .then(function (resultadoAutenticar) {
      console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
      console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);
      if (resultadoAutenticar.length > 0 ) {
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


module.exports = {
  listarTotemStatus,
  listarStatusManutencao,
  listarDadosCPU,
  listarDadosMemoria,
  listarDadosKpis,
  listarDadosRede,
  autenticarTotem,
  autenticar
};