var express = require("express");
var router = express.Router();

var dashChartsController = require("../controllers/dashChartsController");

router.get('/listarDadosKPI/:idTotem', function(req,res){
    dashChartsController.listarDadosKPI(req,res);
})

router.post('/atualizarStatusManutencao/:idTotem', function(req,res){
    dashChartsController.atualizarStatusManutencao(req,res);
})

router.get('/listarDadosCPU/:idTotem/:idEmpresa', function(req,res){
    dashChartsController.listarDadosCPU(req,res);
})

router.get('/listarDadosRede/:idTotem/:idEmpresa', function(req,res){
    dashChartsController.listarDadosRede(req,res);
})

router.get('/listarDadosDisco/:idTotem/:idEmpresa', function(req,res){
    dashChartsController.listarDadosDisco(req,res);
})

module.exports = router;