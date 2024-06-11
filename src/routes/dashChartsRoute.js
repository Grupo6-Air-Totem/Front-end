var express = require("express");
var router = express.Router();

var dashChartsController = require("../controllers/dashChartsController");

router.get('/listarDadosKPI/:idTotem', function(req,res){
    dashChartsController.listarDadosKPI(req,res);
})

router.post('/atualizarStatusManutencao/:idTotem', function(req,res){
    debugger
    dashChartsController.atualizarStatusManutencao(req,res);
})


module.exports = router;