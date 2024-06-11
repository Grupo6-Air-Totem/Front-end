var express = require("express");
var router = express.Router();

var dashSuporteController = require("../controllers/dashSuporteController");


router.get('/listarTotemStatus/:idTerminal/:idEmpresa', function(req,res){
    dashSuporteController.listarTotemStatus(req,res);
});

router.get('/updateTable', function(req,res){
    dashSuporteController.updateTable(req,res);
});

router.post(`/autenticar/:idTerminal`, function(req,res){
    dashSuporteController.autenticar(req,res);
})

router.get(`/listarStatusManutencao/:idTerminal/:idEmpresa`, function(req,res){
    dashSuporteController.listarStatusManutencao(req,res);
})

router.get('/listarDadosKpis/:idTerminal/:idEmpresa', function(req,res){
    dashSuporteController.listarDadosKpis(req,res);
})

router.get(`/listarDadosCPU/:idTerminal/:idEmpresa`, function(req,res){
    dashSuporteController.listarDadosCPU(req,res);
})

router.get(`/listarDadosMemoria/:idTerminal/:idEmpresa`, function(req,res){
    dashSuporteController.listarDadosMemoria(req,res);
})

router.get(`/listarDadosRede/:idTerminal/:idEmpresa`, function(req,res){
    dashSuporteController.listarDadosRede(req,res);
} )

router.post(`/autenticarTotem/:idTotem/:idEmpresa/:idTerminal`, function(req,res){
    dashSuporteController.autenticarTotem(req,res);
})


module.exports = router;