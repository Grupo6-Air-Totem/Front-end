var express = require("express");
var router = express.Router();

var dashGeralController = require("../controllers/dashGeralController");


router.get('/listarTerminalStatus/:idEmpresa', function(req,res){
    dashGeralController.listarTerminalStatus(req,res);
});

router.get('/listarTerminalStatusManutencao/:idEmpresa', function(req,res){
    dashGeralController.listarTerminalStatusManutencao(req,res);
})


router.get('/updateTableTerminal', function(req,res){
    dashGeralController.updateTableTerminal(req,res);
});

router.post(`/autenticar/:idTerminal`, function(req,res){
    dashGeralController.autenticar(req,res);
})

router.get(`/listarDadosKpis/:idEmpresa`, function(req,res){
    dashGeralController.listarDadosKpis(req,res);
})



module.exports = router;