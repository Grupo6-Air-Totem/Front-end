var express = require("express");
var router = express.Router();

var dashGeralController = require("../controllers/dashGeralController");


router.get('/listarTotemStatus', function(req,res){
    dashGeralController.listarTotemStatus(req,res);
});

router.get('/updateTable', function(req,res){
    dashGeralController.updateTable(req,res);
});

router.post(`/autenticar`, function(req,res){
    dashGeralController.autenticar(req,res);
})

module.exports = router;