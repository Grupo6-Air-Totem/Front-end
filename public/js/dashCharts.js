google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(plotarDashCPU);

window.onload = function (){
    dadosTotem();
    obterDadosKPIGeral();
    // Attach event listeners to buttons
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
  debugger
    var idEmpresa = sessionStorage.ID_EMPRESA;
    var idTotem = sessionStorage.ID_TOTEM;
    var url =  `http://localhost:8080/dashChartsRoute/listarDadosCPU/${idTotem}/${idEmpresa}`
  
    var jsonData = $.ajax({
      dataType: "json",
      url : url,
      async: false
    }).responseText

    var data = JSON.parse(jsonData);
    console.log(data);


        // Cria a DataTable do Google Charts com os dados recebidos
        var dataCpu = new google.visualization.DataTable();
  
        // Adiciona colunas à DataTable
        dataCpu.addColumn('number', 'Id historico'); // ou 'number' se ID_HISTORICO for numérico
        dataCpu.addColumn('number', '% Uso');
  
        // Adiciona uma linha à DataTable
        // dataCpu.addRows([
        //   [0, 0]
        //   [1, data[0].USO_CPU]
        // ]);

        dataCpu.addRows([
          [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
          [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
          [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
          [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
          [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
          [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65]
          ]);
  
        // Define as opções do gráfico
        var options = {
                    hAxis: {
                      title: '60seconds',
                      titleTextStyle: {italic: false, fontSize: 15,  alignment: 'center'},
                      gridlines:{
                        color: 'transparent'
                      }
                    },
                    vAxis: {
                      titleTextStyle: {italic: false , fontSize: 15}
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
            legend: {fontSize: 10, position: 'labeled'},
            chartArea: {
              backgroundColor: {strokeWidth: 2}
            }
          };
  
        // Cria o gráfico de área do Google Charts
        debugger
        var documento = document.getElementById('CPUchart_div');
        var chart = new google.visualization.AreaChart(documento);
        chart.draw(dataCpu, options);
}
  