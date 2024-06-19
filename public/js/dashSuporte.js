
google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(plotarDashCPU);
google.charts.setOnLoadCallback(plotarDashMemoria);
google.charts.setOnLoadCallback(plotarDashRede);

window.onload = function () {
    obterDadosKpis(),
    obterDadosTabelaManutencao(),
    obterDadosTabelaTotem(),
    validarSessaoTerminal();
  };

  setInterval(obterDadosTabelaTotem, 3000);
  // setInterval(obterDadosKpis, 5000);
  // setInterval(obterDadosTabelaManutencao, 5000);
  
  function obterDadosTabelaTotem() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    var idTerminal = sessionStorage.ID_TERMINAL;
    fetch(`/dashSuporteRoute/listarTotemStatus/${idTerminal}/${idEmpresa}`, { cache: "no-store" })
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (resposta) {
            // console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
  
            plotarTableTotem(resposta);
          });
        } else {
          console.error("Nenhum dado encontrado ou erro na API");
        }
      })
      .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/gráficos: ${error.message}`);
      });
  }
  
  function limparTabelaTotem() {
    const tabela = document.querySelector(".table-Totens");
    while (tabela.rows.length > 1) { // Mantém o cabeçalho da tabela
      tabela.deleteRow(1);
    }
  }

  function plotarTableTotem(resposta) {
    console.log("Iniciando plotagem da tabela...");
  
    // Limpa a tabela antes de plotar novos dados
    limparTabelaTotem();
  
    let clickedValue = "";
  
    const tabela = document.querySelector(".table-Totens");
  
    resposta.forEach((totens) => {
      const novaLinha = document.createElement("tr");
      const tdIdTotem = document.createElement("td");
      const tdCPU = document.createElement("td");
      const tdDisco = document.createElement("td");
      const tdMemoria = document.createElement("td");
      const tdRede = document.createElement("td");
  
      tdCPU.textContent = totens.USO_PROCESSADOR + "%";
      tdDisco.textContent = totens.DISCO_DISPONIVEL + "%";
      tdMemoria.textContent = totens.USO_MEMORIA + "%";
      tdRede.textContent = totens.VELOCIDADE_REDE + " Mbps";
  
      const IDLink = document.createElement("a");
      IDLink.href = "#";
      IDLink.innerText = totens.ID_TOTEM;
  
      IDLink.setAttribute("name", "linkTotem");
      IDLink.setAttribute("data-id", totens.ID_TOTEM);
      IDLink.addEventListener("click", function (event) {
        event.preventDefault();
        clickedValue = this.getAttribute("data-id");
        if (sessionStorage.NIVEL_ACESSO == "Suporte") {
          autenticarTotem(clickedValue);
        }
      });
      tdIdTotem.appendChild(IDLink);
      novaLinha.appendChild(tdIdTotem);
      novaLinha.appendChild(tdCPU);
      novaLinha.appendChild(tdDisco);
      novaLinha.appendChild(tdMemoria);
      novaLinha.appendChild(tdRede);
  
      tabela.appendChild(novaLinha);
    });
  }

  function atualizarTabelaTotem() {
  var idEmpresa = sessionStorage.ID_EMPRESA;
  var idTerminal = sessionStorage.ID_TERMINAL;
  fetch(`/dashSuporteRoute/listarTotemStatus/${idTerminal}/${idEmpresa}`, { cache: "no-store" })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (novoRegistro) {
          console.log(`Dados recebidos:${novoRegistro}`);
          limparTabelaTotem();
          plotarTableTotem(novoRegistro);
          // Atualiza a tabela a cada 50 segundos
          setTimeout(atualizarTabelaTotem, 50000);
        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
        setTimeout(atualizarTabelaTotem, 50000);
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/tabela: ${error.message}`);
      setTimeout(atualizarTabelaTotem, 50000);
    });
}

  function obterDadosTabelaManutencao() {

  var idEmpresa = sessionStorage.ID_EMPRESA;
  var idTerminal = sessionStorage.ID_TERMINAL;
  fetch(`/dashSuporteRoute/listarStatusManutencao/${idTerminal}/${idEmpresa}`, { cache: "no-store" })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (resposta) {
          console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
          plotarTableManutencao(resposta);

          // Após plotar a tabela inicialmente, inicia a atualização periódica
          atualizarTabelaManutencao();
        });
      } else {
        console.error("Nenhum dado encontrado ou erro na API");
      }
    })
    .catch(function (error) {
      console.error(`Erro na obtenção dos dados p/gráficos: ${error.message}`);
    });
  }

  let ultimosDadosRecebidos = []; // Variável global para armazenar os últimos dados recebidos

  function plotarTableManutencao(resposta) {
    console.log("Iniciando plotagem da tabela...");
  
    const tabela = document.querySelector(".table-manutencao");
  
    // Limpa a tabela antes de adicionar novas linhas
  
    resposta.forEach((manutencao) => {
      const novaLinha = document.createElement("tr");
      const tdIdTotem = document.createElement("td");
      const tdColocadoManutencao = document.createElement("td");
      const tdStatus = document.createElement("td");
      tdIdTotem.innerHTML = "";
      tdColocadoManutencao.innerHTML = "";
      tdStatus.innerHTML = "";
  
      const IDLink = document.createElement("a");
      IDLink.href = "#";
      IDLink.innerText = manutencao.ID_TOTEM;
      IDLink.setAttribute("data-id", manutencao.ID_TOTEM);
      IDLink.addEventListener("click", function (event) {
        event.preventDefault();
        const clickedValue = this.getAttribute("data-id");
        if (sessionStorage.NIVEL_ACESSO == "Suporte") {
          autenticarTotem(clickedValue);
        }
      });
  
      tdIdTotem.appendChild(IDLink);
      novaLinha.appendChild(tdIdTotem);
  
      tdColocadoManutencao.textContent = manutencao.ENTRADA_MANU;
      novaLinha.appendChild(tdColocadoManutencao);
  
      tdStatus.textContent = manutencao.STATUS_TOTEM;
      novaLinha.appendChild(tdStatus);
  
      tabela.appendChild(novaLinha);
    });
  
    // Atualiza a variável global com os novos dados recebidos
    ultimosDadosRecebidos = resposta;
  }
  
  function atualizarTabelaManutencao() {
    var idTerminal = sessionStorage.ID_TERMINAL;
    fetch(`/dashSuporteRoute/listarStatusManutencao/${idTerminal}`, { cache: "no-store" })
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (novoRegistro) {
            console.log(`Dados recebidos: ${JSON.stringify(novoRegistro)}`);
  
            const linhasTabela = document.querySelectorAll(".table-manutencao tr");
            linhasTabela.forEach((linha) => {
              const idTotem = linha.querySelector("a").getAttribute("data-id");
  
              // Encontra o registro correspondente na resposta atualizada
              const registroAtualizado = novoRegistro.find(registro => registro.ID_TOTEM === idTotem);
              if (registroAtualizado) {
                // Verifica se os dados são diferentes antes de atualizar
                const indice = ultimosDadosRecebidos.findIndex(dado => dado.ID_TOTEM === idTotem);
                if (JSON.stringify(ultimosDadosRecebidos[indice]) !== JSON.stringify(registroAtualizado)) {
                  linha.children[1].textContent = registroAtualizado.ENTRADA_MANU;
                  linha.children[2].textContent = registroAtualizado.STATUS_TOTEM;
                }
              }
            });
  
            // Atualiza a variável global com os novos dados recebidos
            ultimosDadosRecebidos = novoRegistro;
  
            // Limpa o temporizador anterior antes de agendar um novo
            clearTimeout(timerAtualizacao);
  
            // Agendando próxima atualização
            timerAtualizacao = setTimeout(atualizarTabelaManutencao, 50000);
          });
        } else {
          console.error("Nenhum dado encontrado ou erro na API");
        }
      })
      .catch(function (error) {
        console.error(`Erro na obtenção dos dados p/tabela: ${error.message}`);
      });
  }

  function obterDadosKpis() {
  var idEmpresa = sessionStorage.ID_EMPRESA;
  var idTerminal = sessionStorage.ID_TERMINAL;
    fetch(`/dashSuporteRoute/listarDadosKpis/${idTerminal}/${idEmpresa}`, { cache: "no-store" })
    .then(function (resposta){
      if(resposta.ok){
        console.log("Dados KPIs: " + resposta);
        resposta.json().then((jsonResp) =>{
          if(jsonResp.length > 0){
            sessionStorage.ID_TERMINAL = jsonResp[0].idTerminal;
            sessionStorage.TOTAL_TOTEM_TER = jsonResp[0].TOTAL_TOTENS;
            sessionStorage.TOTAL_INATIVO = jsonResp[0].TOTAL_TOTENS_INATIVOS;
            sessionStorage.TOTAL_MANUTENCAO = jsonResp[0].TOTAL_TOTENS_MANU;
            sessionStorage.TOTAL_ATIVO = jsonResp[0].TOTAL_TOTENS_ATIVOS;
            
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
    console.log("Iniciando plotagem da KPI GERAL...");

    console.log("Dados recebidos: ", JSON.stringify(jsonResp));


    const boxprogress = document.querySelector(".progress");
    const progressBarSuccess = document.querySelector(".progress-bar.bg-success");
    const progressBarWarning = document.querySelector(".progress-bar.bg-warning");
    var totalTotens = document.getElementById ("total_totens")
    
    jsonResp.forEach((totemStatus) => {

      let total = totemStatus.TOTAL_TOTENS;
      totalTotens.innerHTML = total;
      let ativo = (totemStatus.TOTAL_TOTENS_ATIVOS / total) * 100;
      let parado = ((totemStatus.TOTAL_TOTENS_MANU + totemStatus.TOTAL_TOTENS_INATIVOS) / total) * 100;

      if (parado === 0) {
        ativo = 100;
        parado = 0; // Define parado como 0%
    }

    progressBarSuccess.style.width = `${ativo}%`;
    progressBarSuccess.textContent = `${ativo.toFixed(1)}%`;

    progressBarWarning.style.width = `${parado}%`;
    progressBarWarning.textContent = `${parado.toFixed(1)}%`;
      })
  }
  
  function plotarDashCPU(){ 
    var idEmpresa = sessionStorage.ID_EMPRESA;
    var idTerminal = sessionStorage.ID_TERMINAL;
      var jsonData = $.ajax({
      url: `http://localhost:8080/dashSuporteRoute/listarDadosCPU/${idTerminal}/${idEmpresa}`,
      dataType: "json",
      async: false
    }).responseText;

    var data = JSON.parse(jsonData);
    console.log("Dados dash CPU: " + data);
    var dataCpu = new google.visualization.DataTable();
    dataCpu.addColumn('string', 'Status');
    dataCpu.addColumn('number', 'Quantidade');

    dataCpu.addRows([
      ['Ok', Number(data[0].totens_ok)],
      ['Lento', Number(data[0].totens_lentos)],
      ['Alerta', Number(data[0].totens_em_alerta)]
    ])
  
    var options = {
      title: 'CPU',
      titleTextStyle: {
        fontSize: 16,
        textPosition: 'center'
      },
      legend: { textStyle: { fontSize: 14,},  position: 'right' },
      backgroundColor: { fill:'transparent' },
      pieHole: 0.87,
      chartArea:{
        height:'70%',
        width: '90%'
        
      },
      colors:['#00FF00','#FFFF00','#FF0000'],
      pieSliceTextStyle: {
        color: 'black',
      }
    };

    var chart = new google.visualization.PieChart(document.getElementById('Chart_divCPU'));
    chart.draw(dataCpu, options);
  }

  function plotarDashMemoria(){
    var idTerminal = sessionStorage.ID_TERMINAL;
    var idEmpresa = sessionStorage.ID_EMPRESA;
    var jsonData = $.ajax({
      url: `http://localhost:8080/dashSuporteRoute/listarDadosMemoria/${idTerminal}/${idEmpresa}`,
      dataType: "json",
      async: false
    }).responseText;

    var data = JSON.parse(jsonData);
    console.log("Dados dash memoria: " + data);
    var dataMemoria = new google.visualization.DataTable();
    dataMemoria.addColumn('string', 'Status');
    dataMemoria.addColumn('number', 'Quantidade');

    dataMemoria.addRows([
      ['Ok', Number(data[0].totens_ok)],
      ['Lento', Number(data[0].totens_lentos)],
      ['Alerta', Number(data[0].totens_em_alerta)]
    ])
  
    var options = {
      title: 'Memoria',
      titleTextStyle: {
        fontSize: 16,
        textPosition: 'center'
      },
      legend: { textStyle: { fontSize: 14,},  position: 'right' },
      backgroundColor: { fill:'transparent' },
      pieHole: 0.87,
      chartArea:{
        height:'70%',
        width: '90%'
        
      },
      colors:['#00FF00','#FFFF00','#FF0000'],
      pieSliceTextStyle: {
        color: 'black',
      }
    };

    var chart = new google.visualization.PieChart(document.getElementById('Chart_divMemoria'));
    chart.draw(dataMemoria, options);

  }

  function plotarDashRede(){
    var idTerminal = sessionStorage.ID_TERMINAL;
    var idEmpresa = sessionStorage.ID_EMPRESA;
    var jsonData = $.ajax({
      url: `http://localhost:8080/dashSuporteRoute/listarDadosRede/${idTerminal}/${idEmpresa}`,
      dataType: "json",
      async: false
    }).responseText;

    var data = JSON.parse(jsonData);
    console.log("Dados dash rede:" + data);

    var dataRede = new google.visualization.DataTable();
    dataRede.addColumn('string', 'Status');
    dataRede.addColumn('number', 'Quantidade');

    dataRede.addRows([
      ['Ok', Number(data[0].totens_ok)],
      ['Lento', Number(data[0].totens_lentos)],
      ['Alerta', Number(data[0].totens_em_alerta)]
    ])
  
    var options = {
      title: 'Rede',
      titleTextStyle: {
        fontSize: 16,
        textPosition: 'center'
      },
      legend: { textStyle: { fontSize: 14,},  position: 'right' },
      backgroundColor: { fill:'transparent' },
      pieHole: 0.87,
      chartArea:{
        height:'70%',
        width: '90%'
        
      },
      colors:['#00FF00','#FFFF00','#FF0000'],
      pieSliceTextStyle: {
        color: 'black',
      }
    };

    var chart = new google.visualization.PieChart(document.getElementById('Chart_divRede'));
    chart.draw(dataRede, options);
  }

  function autenticarTotem(idTotem){
    var idEmpresa = sessionStorage.ID_EMPRESA;
    var idTerminal = sessionStorage.ID_TERMINAL;
  fetch(`/dashSuporteRoute/autenticarTotem/${idTotem}/${idEmpresa}/${idTerminal}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idTotemServer : idTotem,
      idEmpresaServer : idEmpresa,
      idTerminalServer : idTerminal
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
          sessionStorage.ID_TOTEM = json[0].ID_TOTEM;
          sessionStorage.NOME_TOTEM = json[0].NOME_TOTEM;
          sessionStorage.TEMPO_ATIVIDADE = json[0].TEMPO_ATIVIDADE;
          sessionStorage.MODELO_PROCESSADOR = json[0].MODELO_PROCESSADOR;
          sessionStorage.SO = json[0].SISTEMA_OPERACIONAL;
          sessionStorage.MEMORIA_RAM = json[0].MEMORIA_RAM;
          sessionStorage.HOST_REDE = json[0].HOST_REDE;
        });
        console.log("cheguei aqui!")
        sessionStorage.removeItem('TOTAL_TOTEM_TER');
        sessionStorage.removeItem('TOTAL_INATIVO');
        sessionStorage.removeItem('TOTAL_MANUTENCAO');
        sessionStorage.removeItem('TOTAL_ATIVO');
        window.location = `../dashboard/dashSuporte.html`;
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

  
   
  
  