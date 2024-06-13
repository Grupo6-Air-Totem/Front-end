var database = require("../database/config");
var dashChartsModel = require("../models/dashChartsModel");

function listarDadosKPI(req, res) {
    var totem = req.params.idTotem;
    console.log("TOTEM: " + totem);
    if (totem == undefined) {
        console.log("TOTEM UNDEFINED!");
    } else {
        dashChartsModel
            .listarDadosKPI(totem)
            .then(function(resultado) {
                console.log(`\n Resultados encontrado: ${resultado.length}`);
                console.log(`Resultado: ${JSON.stringify(resultado)}`);

                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(403).send("Totem não existe, ou não foi encontrado");
                }
            }).catch(function(erro) {
                console.log(erro);
                console.log("Houve um erro ao encontrar o totem: " + erro.sqlMessage)
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function verificarStatusManutencao(req, res) {
    const idTotem = req.params.idTotem;
    dashChartsModel.verificarStatusManutencao(idTotem)
        .then(function(resultado) {
            res.status(200).json({ exists: resultado.length > 0 });
        })
        .catch(function(erro) {
            console.log("Erro ao verificar status de manutenção: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function inserirStatusManutencao(req, res) {
    const idTotem = req.params.idTotem;
    const { acao, date } = req.body;
    dashChartsModel.inserirStatusManutencao(idTotem, acao, date)
        .then(function(resultado) {
            res.status(200).json(resultado);
        })
        .catch(function(erro) {
            console.log("Erro ao inserir status de manutenção: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarStatusManutencao(req, res) {
    const idTotem = req.params.idTotem;
    const { acao, date } = req.body;
    dashChartsModel.atualizarStatusManutencao(idTotem, acao, date)
        .then(function(resultado) {
            res.status(200).json(resultado);
        })
        .catch(function(erro) {
            console.log("Erro ao atualizar status de manutenção: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarStatusAtivo(req, res) {
    const idTotem = req.params.idTotem;
    const { acao, date } = req.body;
    dashChartsModel.atualizarStatusAtivo(idTotem, acao, date)
        .then(function(resultado) {
            res.status(200).json(resultado);
        })
        .catch(function(erro) {
            console.log("Erro ao atualizar status ativo: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listarDadosKPI,
    verificarStatusManutencao,
    inserirStatusManutencao,
    atualizarStatusManutencao,
    atualizarStatusAtivo
};
