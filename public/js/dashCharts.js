google.charts.load('current', {'packages':['gauge']});
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(plotarDashCPU);
google.charts.setOnLoadCallback(plotarDashRede);
google.charts.setOnLoadCallback(plotarDashDisco);


window.onload = function (){
    dadosTotem();
    obterDadosKPIGeral();
    
    
    document.getElementById('tirarManutencaoBtn').addEventListener('click', function() {
        updateMaintenanceStatus('remover');
    });

    document.getElementById('colocarManutencaoBtn').addEventListener('click', function() {
        updateMaintenanceStatus('adicionar');
    });
} 

function dadosTotem(){
    var nomeEmpresa = sessionStorage.NOME_EMPRESA;
    var idTotem = sessionStorage.ID_TOTEM;
    var so = sessionStorage.SO;
    var tempoAtv = sessionStorage.TEMPO_ATIVIDADE;
    var memoriaram = sessionStorage.MEMORIA_RAM;
    var hostrede = sessionStorage.HOST_REDE;
    var modelo_processador = sessionStorage.MODELO_PROCESSADOR;

    var spanEmpresa = document.getElementById("nome_empresa");
    var spanTotem = document.getElementById("id_totem");
    var spanSO = document.getElementById("sistema_operacional");
    var spanTempoAtv = document.getElementById("tempo_atividade");
    var spanMemoriaRam = document.getElementById("memoria_ram");
    var spanHost = document.getElementById("host_rede");
    var spanProcessador = document.getElementById("modelo_processador");

    spanEmpresa.innerHTML = nomeEmpresa;
    spanTotem.innerHTML = idTotem;
    spanSO.innerHTML = so;
    spanTempoAtv.innerHTML = tempoAtv;
    spanMemoriaRam.innerHTML = memoriaram;
    spanHost.innerHTML = hostrede;
    spanProcessador.innerHTML = modelo_processador;
    console.log("NOME EMPRESA: "+ spanEmpresa);
}

function obterDadosKPIGeral() {
  var idTotem = sessionStorage.ID_TOTEM;
  fetch(`/dashChartsRoute/listarDadosKPI/${idTotem}`, { cache: 'no-store' })
  .then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then(function (resposta) {
        if (resposta.length > 0) {
          sessionStorage.STATUS_CPU = resposta[0].status_cpu;
          sessionStorage.STATUS_MEMORIA = resposta[0].status_memoria;
          sessionStorage.STATUS_REDE = resposta[0].status_rede;
          sessionStorage.STATUS_GERAL = resposta[0].status_geral;
          sessionStorage.USO_CPU = resposta[0].USO_PROCESSAOR;
          sessionStorage.VELOCIDADE_REDE = resposta[0].VELOCIDADE_REDE;
          sessionStorage.USO_MEMORIA = resposta[0].USO_MEMORIA;

          console.log("status cpu: " + sessionStorage.STATUS_CPU);
          console.log("status memoria: " + sessionStorage.STATUS_MEMORIA);
          console.log("status REDE: " + sessionStorage.STATUS_REDE);
          console.log("uso cpu: " + sessionStorage.USO_CPU);
          console.log("uso memoria: " + sessionStorage.USO_MEMORIA);
          console.log("uso REDE: " + sessionStorage.VELOCIDADE_REDE);
        
          plotarKPIGeral(resposta);
        } else {
          console.log("JSON ESTÁ VAZIO!");
        }
      });
    } else {
      console.log(`Houve algum erro ao tentar buscar os dados da KPI`);
    }
  });
}

function plotarKPIGeral(resposta){
    console.log("Iniciando plotagem da KPI GERAL...");

    console.log("Dados recebidos: ", JSON.stringify(resposta));

    resposta.forEach(totemStatus => {
        var statusCPU = totemStatus.status_cpu;
        var statusREDE = totemStatus.status_rede;
        var statusMemoria = totemStatus.status_memoria;
        var statusGeral = totemStatus.status_geral;

        var corStatus = document.getElementById("statusGeral");
        var corCPU = document.getElementById("corCPU");
        var corMEMORIA = document.getElementById("corMemoria");
        var corREDE = document.getElementById("corRede"); 
        console.log("status geral:" + statusGeral);
        corStatus.innerHTML = statusGeral;

        if(statusGeral == "ALERTA"){
            corStatus.style.color = "#FF0000";
        }else if(statusGeral == "OK"){
            corStatus.style.color = "#00FF00";
        }else{
            corStatus.style.color = "#FFFF00";
        }

        if(statusCPU == "ALERTA"){
            corCPU.style.color = "#FF0000";
        }else if(statusCPU == "OK"){
            corCPU.style.color = "#00FF00";
        }else{
            corCPU.style.color = "#FFFF00";
        }
        
        if(statusREDE == "ALERTA"){
            corREDE.style.color = "#FF0000";
        }else if(statusREDE == "OK"){
            corREDE.style.color = "#FF0000";
        }else{
            corREDE.style.color = "#FFFF00";
        }

        if(statusMemoria == "ALERTA"){
            corMEMORIA.style.color = "#FF0000";
        }else if(statusMemoria == "OK"){
            corMEMORIA.style.color = "#00FF00";
        }else{
            corMEMORIA.style.color = "#FFFF00";
        }
    });
}

function updateMaintenanceStatus(action) {
    let now = new Date();
    let formattedDate = now.toISOString().slice(0, 19).replace('T', ' '); // Format date as YYYY-MM-DD HH:MM:SS

    fetch(`/dashChartsRoute/atualizarStatusManutencao/${sessionStorage.ID_TOTEM}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            acao: action,
            date: formattedDate
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Após atualização, recarregar os dados
        obterDadosKPIGeral();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function plotarDashCPU() {
  var idEmpresa = sessionStorage.ID_EMPRESA;
  var idTotem = sessionStorage.ID_TOTEM;
  var url = `http://localhost:8080/dashChartsRoute/listarDadosCPU/${idTotem}/${idEmpresa}`;

  var dataCpu = new google.visualization.DataTable();
  dataCpu.addColumn('number', 'Id historico'); // ou 'number' se ID_HISTORICO for numérico
  dataCpu.addColumn('number', '% Uso');

  var options = {
      hAxis: {
          title: '60 seconds',
          titleTextStyle: { italic: false, fontSize: 15, alignment: 'center' },
          gridlines: {
              color: 'transparent'
          }
      },
      vAxis: {
          titleTextStyle: { italic: false, fontSize: 15 }
      },
      series: {
          0: {
              color: 'orange'
          },
      },
      title: "Cpu",
      titleTextStyle: {
          fontSize: 28
      },
      legend: { fontSize: 10, position: 'labeled' },
      chartArea: {
          backgroundColor: { strokeWidth: 2 }
      }
  };

  var chart = new google.visualization.AreaChart(document.getElementById('CPUchart_div'));

  function atualizarDados() {
      $.ajax({
          dataType: "json",
          url: url,
          async: true,
          success: function(data) {
              var newRows = [];
              for (var i = 0; i < data.length; i++) {
                  newRows.push([data[i].ID_HISTORICO, data[i].USO_CPU]);
              }
              dataCpu.addRows(newRows);
              chart.draw(dataCpu, options);
          }
      });
  }

  // Atualiza os dados a cada 5 segundos
  setInterval(atualizarDados, 5000);

  // Desenha o gráfico pela primeira vez
  atualizarDados();
}

function plotarDashRede() {
  var idEmpresa = sessionStorage.ID_EMPRESA;
  var idTotem = sessionStorage.ID_TOTEM;
  var url = `http://localhost:8080/dashChartsRoute/listarDadosRede/${idTotem}/${idEmpresa}`;

  var dataRede = new google.visualization.DataTable();
  dataRede.addColumn('number', 'Id historico'); // ou 'number' se ID_HISTORICO for numérico
  dataRede.addColumn('number', 'Mbps');

  var options = {
      hAxis: {
          title: '60 seconds',
          titleTextStyle: { italic: false, fontSize: 15, alignment: 'center' },
          gridlines: {
              color: 'transparent'
          }
      },
      vAxis: {
          titleTextStyle: { italic: false, fontSize: 15 }
      },
      series: {
          0: {
              color: 'blue'
          },
      },
      title: "Rede",
      titleTextStyle: {
          fontSize: 28
      },
      legend: { fontSize: 10, position: 'labeled' },
      chartArea: {
          backgroundColor: { strokeWidth: 2 }
      }
  };

  var chart = new google.visualization.AreaChart(document.getElementById('Redechart_div'));

  function atualizarDados() {
      $.ajax({
          dataType: "json",
          url: url,
          async: true,
          success: function(data) {
              var newRows = [];
              for (var i = 0; i < data.length; i++) {
                  newRows.push([data[i].ID_HISTORICO, data[i].VELOCIDADE_REDE]);
              }
              dataRede.addRows(newRows);
              chart.draw(dataRede, options);
          }
      });
  }

  // Atualiza os dados a cada 5 segundos
  setInterval(atualizarDados, 5000);

  // Desenha o gráfico pela primeira vez
  atualizarDados();
}

function plotarDashDisco() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    var idTotem = sessionStorage.ID_TOTEM;
    var url = `http://localhost:8080/dashChartsRoute/listarDadosDisco/${idTotem}/${idEmpresa}`;
  
    var dataDisco = new google.visualization.DataTable();
    dataDisco.addColumn('string', 'Categoria');
    dataDisco.addColumn('number', 'Valor');
  
    var options = {
        title: 'Disco',
        titleTextStyle: {
            fontSize: 16,
            textPosition: 'center'
        },
        legend: {
            textStyle: { fontSize: 14 },
            position: 'bottom'
        },
        backgroundColor: { fill: 'transparent' },
        pieHole: 0.87,
        chartArea: {
            height: '70%',
            width: '90%'
        },
        colors: ['#00FF00', '#FFFF00'],
        pieSliceTextStyle: {
            color: 'black'
        }
    };
  
    var chart = new google.visualization.PieChart(document.getElementById('DiscChart_div'));
  
    function atualizarDados() {
        $.ajax({
            dataType: "json",
            url: url,
            async: true,
            success: function(data) {
                var newRows = [];
                for (var i = 0; i < data.length; i++) {
                    newRows.push(['Disponível', data[i].DISPONIVEL]);
                    newRows.push(['Usando', 100 - data[i].DISPONIVEL]); // Considerando que o total é 100%
                }
                dataDisco.removeRows(0, dataDisco.getNumberOfRows()); // Remove linhas antigas
                dataDisco.addRows(newRows);
                chart.draw(dataDisco, options);
            }
        });
    }
  
    // Atualiza os dados a cada 5 segundos
    setInterval(atualizarDados, 5000);
  
    // Desenha o gráfico pela primeira vez
    atualizarDados();
}