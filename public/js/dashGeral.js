

function obterDadosTabelaTerminal() {
  var idEmpresa = sessionStorage.ID_EMPRESA;
  console.log("ESTOU NO OBTER DATDOS TABELA TERMINAL")
  fetch(`/dashGeralRoute/listarTerminalStatus/${idEmpresa}`, { cache: "no-store" })
    .then(function (response) {
      if (response.ok) {
        console.log("RESPOSTA OK")
        response.json()
        
      
        .then(function (resposta) {
          console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
         
          plotarTableTerminal(resposta);
        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/gráficos: ${error.message}`);
    });
}

function plotarTableTerminal(resposta) {
  console.log("Iniciando plotagem da tabela...");

  console.log("Dados recebidos: ", JSON.stringify(resposta));

  let clickedValue = "";

  const tabela = document.querySelector(".table-terminais");

  resposta.forEach((terminal) => {

    const novaLinha = document.createElement("tr");
    const tdAeroporto = document.createElement("td");
    const tdTerminal = document.createElement("td");
    const tdTotal = document.createElement("td");
    const tdAtivos = document.createElement("td");
    const tdInativos = document.createElement("td");
    const tdManutencao = document.createElement("td");

    tdAeroporto.textContent = terminal.NOME_AEROPORTO;
    tdTotal.textContent = terminal.TOTAL_TOTENS;
    tdAtivos.textContent = terminal.TotensAtivos;
    tdInativos.textContent = terminal.TotensInativos;
    tdManutencao.textContent = terminal.TotensEmManutencao;
    const IDLink = document.createElement("a");
    IDLink.href = "#";
    IDLink.innerText = terminal.TERMINAL;

    IDLink.setAttribute("name", "linkTerminal");

    IDLink.setAttribute("data-id", terminal.TERMINAL);
    IDLink.addEventListener("click", function (event) {
      event.preventDefault();
      clickedValue = this.getAttribute("data-id");
      autenticarTerminal(clickedValue);
      
    });
    tdTerminal.appendChild(IDLink);
    novaLinha.appendChild(tdAeroporto);
    novaLinha.appendChild(tdTerminal);
    novaLinha.appendChild(tdTotal);
    novaLinha.appendChild(tdAtivos);
    novaLinha.appendChild(tdInativos);
    novaLinha.appendChild(tdManutencao);

    tabela.appendChild(novaLinha);



    
  });
  console.log(clickedValue);
  // setTimeout(() => atualizarTabela(),50000);
}

function atualizarTabelaTerminal() {
  let proximaAtualizacao;

  fetch(`/dashGeralRoute/listarTerminalStatus`, { cache: "no-store" })
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

// function autenticarDash() {
//   fetch(`/dashGeralRoute/autenticar`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then(function (resposta) {
//     console.log("ESTOU NO THEN DO entrar()!");
//     if (resposta.ok) {
//       console.log(resposta);
//       setTimeout(function () {});
//     }
//   });
// }

function autenticarTerminal(idTerminal) {
  console.log("Terminal: " + idTerminal);

  fetch(`/dashGeralRoute/autenticar/${idTerminal}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idTerminalServer: idTerminal,
    }),
  })
    .then(function (resposta) {
      console.log("Estou no THEN do AUTENTICAR TERMINAL");
      console.log(resposta)
      if (resposta.ok) {
        console.log(resposta);

        resposta.json().then((json) => {
          console.log(json);
          console.log(JSON.stringify(json));
          sessionStorage.ID_TERMINAL = json[0].idTerminal;
        });

        if(sessionStorage.NIVEL_ACESSO == "Gerente"){
          sessionStorage.removeItem('EMAIL_USUARIO');
          sessionStorage.removeItem('TOTAL_TOTENS_EMPRESA');
          sessionStorage.removeItem('TOTAL_TOTENS_ATIVOS');
          sessionStorage.removeItem('TOTAL_TOTENS_INATIVOS');
          sessionStorage.removeItem('TOTAL_TOTENS_MANUTENCAO');

          window.location = `../dashboard/setorGerente.html`
        }else{
          sessionStorage.removeItem('EMAIL_USUARIO');
          sessionStorage.removeItem('TOTAL_TOTENS_EMPRESA');
          sessionStorage.removeItem('TOTAL_TOTENS_ATIVOS');
          sessionStorage.removeItem('TOTAL_TOTENS_INATIVOS');
          sessionStorage.removeItem('TOTAL_TOTENS_MANUTENCAO');
          window.location = `../dashboard/setorSuporte.html`;
        }
      } else {
        console.log(
          "Houve algum erro ao tentar buscar os dados do terminal/totem para renderizar a pagina"
        );
      }
    })
    .catch(function (erro) {
      console.log(erro);
    });
  return false;
}

function obterDadosKpis() {
  var idEmpresa = sessionStorage.ID_EMPRESA;
  console.log("idEmpresaaa",idEmpresa);
    fetch(`/dashGeralRoute/listarDadosKpis/${idEmpresa}`, { cache: "no-store" })
    .then(function (resposta){
      if(resposta.ok){
        console.log(resposta);
        resposta.json().then((jsonResp) =>{
          console.log("chegou aqui")
          if(jsonResp.length > 0){
            sessionStorage.TOTAL_TOTENS_EMPRESA = jsonResp[0].TOTAL_TOTENS_EMPRESA;
            sessionStorage.TOTAL_TOTENS_ATIVOS = jsonResp[0].TOTAL_TOTENS_ATIVOS;
            sessionStorage.TOTAL_TOTENS_MANUTENCAO = jsonResp[0].TOTAL_TOTENS_MANU;
            sessionStorage.TOTAL_TOTENS_INATIVOS = jsonResp[0].TOTAL_TOTENS_INATIVOS;
            
            plotarKPIGeral(jsonResp);

          }else{
            console.log("Json está vazio!");
          }
   
        })
      }
      else{
        console.log(
          "Houve algum erro ao tentar buscar os dados das kpis"
        );
      }
    })
}

function plotarKPIGeral(jsonResp){

  var nomeEmpresa = document.getElementById("nome_empresa")
  nomeEmpresa.innerHTML = sessionStorage.NOME_EMPRESA;

    jsonResp.forEach((totemStatus) => {
      
      var totalEmpresa = document.getElementById("totalEmpresa");
      var totalAtivo = document.getElementById("totens_ativos");
      var totalInativo = document.getElementById("totens_inativo");
      var totalManutencao = document.getElementById("totens_manutencao");
      var porcentAtivo = document.getElementById("porcent_ativo");
      var porcentInativo = document.getElementById("porcent_inativo");
      var porcentManutencao = document.getElementById("porcent_manutencao");

      totalEmpresa.innerHTML = totemStatus.TOTAL_TOTENS_EMPRESA;
      totalEmpresa.style.color = "#3478C7";
      totalAtivo.innerHTML = "Qtd totem: " + totemStatus.TOTAL_TOTENS_ATIVOS;
      totalAtivo.style.color = "#3478C7";
      totalAtivo.style.fontSize = "20px"
      totalInativo.innerHTML ="Qtd totem: " + totemStatus.TOTAL_TOTENS_INATIVOS;
      totalInativo.style.color = "#3478C7";
      totalInativo.style.fontSize = "20px";
      totalManutencao.innerHTML ="Qtd totem: " + totemStatus.TOTAL_TOTENS_MANU;
      totalManutencao.style.color = "#3478C7";
      totalManutencao.style.fontSize = "20px";
      function roundUpToOneDecimal(num) {
        return Math.ceil(num * 10) / 10;
      }

      debugger
      let porcentA = roundUpToOneDecimal((totemStatus.TOTAL_TOTENS_ATIVOS / totemStatus.TOTAL_TOTENS_EMPRESA) * 100);
      let porcentI = roundUpToOneDecimal(( totemStatus.TOTAL_TOTENS_INATIVOS/ totemStatus.TOTAL_TOTENS_EMPRESA) * 100);
      let porcentM = roundUpToOneDecimal((totemStatus.TOTAL_TOTENS_MANU / totemStatus.TOTAL_TOTENS_EMPRESA) * 100);

      porcentAtivo.innerHTML = porcentA.toFixed(0) + "%";
      porcentAtivo.style.color = "green"
      porcentInativo.innerHTML = porcentI.toFixed(0) + "%";
      porcentInativo.style.color = "red"
      porcentManutencao.innerHTML = porcentM.toFixed(0) + "%";
      porcentManutencao.style.color = "orange"



    });


    // Monta a estrutura de elementos
   
}

