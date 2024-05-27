window.onload = function () {
  obterDadosTabela();
};

function obterDadosTabela() {
  console.log("321321");
  fetch(`/dashGeralRoute/listarTotemStatus`, { cache: "no-store" })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (resposta) {
          console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

          plotarTable(resposta);
        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/gráficos: ${error.message}`);
    });
}

function plotarTable(resposta) {
  console.log("Iniciando plotagem da tabela...");

  console.log("Dados recebidos: ", JSON.stringify(resposta));


  const tabela = document.querySelector(".table-terminais");
  const novaLinha = document.createElement("tr");
  const tdTerminal = document.createElement("td");
  const tdTotal = document.createElement("td");
  const tdAtivos = document.createElement("td");
  const tdInativos = document.createElement("td");
  const tdManutencao = document.createElement("td");


  const idTerminalStorage = resposta.idTerminal;
  const IDLink = document.createElement("a");
  IDLink.textContent = idTerminalStorage;
  IDLink.href = "#";
  novaLinha.setAttribute("data-id", resposta.idTerminalStorage);
  IDLink.addEventListener("click", function (event) {
    event.preventDefault();
    const clickedValue = event.target.getAttribute("data-id");
  });

  console.log("AAAAAA");


  window.location = "./dashboard/geralSuporte.html";

  resposta.forEach((terminal) => {
    tdTerminal.textContent = terminal.idTerminal;
    tdTotal.textContent = terminal.TotalTotens;
    tdAtivos.textContent = terminal.TotensAtivos;
    tdInativos.textContent = terminal.TotensInativos;
    tdManutencao.textContent = terminal.TotensEmManutencao;

    IDLink.appendChild(tdTerminal);
    novaLinha.appendChild(IDLink);
    novaLinha.appendChild(tdTotal);
    novaLinha.appendChild(tdAtivos);
    novaLinha.appendChild(tdInativos);
    novaLinha.appendChild(tdManutencao);

    tabela.appendChild(novaLinha);
  });

  // setTimeout(() => atualizarTabela(),50000);
}

function atualizarTabela() {
  let proximaAtualizacao;

  fetch(`/dashGeralRoute/listarTotemStatus`, { cache: "no-store" })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (novoRegistro) {
          obterDadosTabela();
          console.log(`Dados recebidos:${JSON.stringify(novoRegistro)}`);
          console.log(`Dados atuais da tabela: `);
          console.log(`${terminal}`);

          if (
            novoRegistro[0].TotensInativos == terminal.TotensInativos &&
            novoRegistro[0].TotensAtivos == terminal.TotensAtivos &&
            novoRegistro[0].TotensEmManutencao == terminal.TotensEmManutencao
          )
            console.log("Não há dados para alterar!");
          else {
            var total =
              novoRegistro.TotensAtivos +
              novoRegistro.TotensInativos +
              novoRegistro.TotensEmManutencao;

            terminal.TotalTotens.textContent += total;
            terminal.TotensInativos.textContent += novoRegistro.TotensInativos;
            terminal.TotensAtivos.textContent += novoRegistro.TotensAtivos;
            terminal.TotensEmManutencao.textContent +=
              novoRegistro.TotensEmManutencao;
          }
          proximaAtualizacao = setTimeout(() => atualizarTabela(), 50000);
        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
        proximaAtualizacao = setTimeout(() => atualizarTabela(), 50000);
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/tabela: ${error.message}`);
    });
}

function autenticarDash() {
  fetch(`/dashGeralRoute/autenticar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (resposta) {
    console.log("ESTOU NO THEN DO entrar()!");
    if (resposta.ok) {
      console.log(resposta);
      setTimeout(function () {});
    }
  });
}
