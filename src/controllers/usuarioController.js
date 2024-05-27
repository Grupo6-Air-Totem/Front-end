var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;

  if (email == undefined) {
    res.status(400).send("Seu email está undefined!");
  } else if (senha == undefined) {
    res.status(400).send("Sua senha está indefinida!");
  } else {
    usuarioModel
      .autenticar(email, senha)
      .then(function (resultadoAutenticar) {
        console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
        console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

        if (resultadoAutenticar.length == 1) {
          res.json({
            idUser: resultadoAutenticar[0].idUser,
            nomeUsuario: resultadoAutenticar[0].nomeUsuario,
            nomeEmpresa: resultadoAutenticar[0].nomeEmpresa,
            email: resultadoAutenticar[0].email,
            empresaId: resultadoAutenticar[0].empresaId,
            nivelAcesso: resultadoAutenticar[0].nivelAcesso,
            aeroId: resultadoAutenticar[0].aeroId, // Adicionando o id do aeroporto na resposta
          });
        } else if (resultadoAutenticar.length == 0) {
          res.status(403).send("Email e/ou senha inválido(s)");
        } else {
          res.status(403).send("Mais de um usuário com o mesmo login e senha!");
        }
      })
      .catch(function (erro) {
        console.log(erro);
        console.log(
          "\nHouve um erro ao realizar o login! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function listar(req, res) {
    var empresaId = req.params.empresaId;
    var aeroportoId = req.params.aeroportoId;

    usuarioModel.listar(empresaId, aeroportoId)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json({ error: erro.sqlMessage });
        });
}

function deletar(req, res) {
  var idUser = req.params.idUser;

  usuarioModel
    .deletar(idUser)
    .then(function (resultado) {
      res.status(200).json({ message: "Usuário deletado com sucesso!" });
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var sobrenome = req.body.sobrenomeServer;
    var email = req.body.emailServer;
    var cpf = req.body.cpfServer;
    var celular = req.body.celularServer;
    var nivelAcesso = req.body.nivelAcessoServer;
    var empresaId = req.body.empresaIdServer;
    var aeroportoId = req.body.aeroportoIdServer;

    if (nome == undefined || sobrenome == undefined || email == undefined || cpf == undefined || celular == undefined || nivelAcesso == undefined || empresaId == undefined || aeroportoId == undefined) {
        res.status(400).send("Um ou mais campos estão undefined!");
    } else {
        usuarioModel.cadastrar(nome, sobrenome, email, cpf, celular, nivelAcesso, empresaId, aeroportoId)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
  autenticar,
  listar,
  deletar,
  cadastrar,
};
