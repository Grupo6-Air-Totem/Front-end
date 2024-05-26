var dashGeralModel = require("../models/dashGeralModel");

function listarTotemStatus(req, res) {
  dashGeralModel
    .listarTotemStatus()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
        res.json(resultado);
      }
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function autenticar(req, res) {
  dashGeralModel.autenticar().then(function (resultadoAutenticar) {
    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

    if (resultadoAutenticar.length > 1) {
      res.json({
        idTotem: resultadoAutenticar[0],
      });
    }
  });
}

module.exports = {
  listarTotemStatus,
  autenticar,
};
