window.onload = function (){
    dadosTotem();
    obterDadosKPIGeral();
} 

function dadosTotem(){
    var nomeEmpresa = sessionStorage.NOME_EMPRESA;
    var idTotem = sessionStorage.ID_TOTEM;
    var so = sessionStorage.SO;
    var tempoAtv = sessionStorage.TEMPO_ATIVIDADE;
    var memoriaram = sessionStorage.MEMORIA_RAM;
    var hostrede = sessionStorage.HOST_REDE;
    var modelo_processador = sessionStorage.MODELO_PROCESSADOR;

    var spanEmpresa = document.getElementById("nome_empresa")
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
    console.log("NOME EMPRESa: "+ spanEmpresa)

}

function obterDadosKPIGeral() {
  var idTotem = sessionStorage.ID_TOTEM;
  fetch(`/dashChartsRoute/listarDadosKPI/${idTotem}`, { cache: 'no-store' })
  .then(function (resposta) {
    if (resposta.ok) {
        console.log(`AAA`);
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

document.addEventListener('DOMContentLoaded', function(){
    var tirarManutencaoBtn = document.getElementById("tirarManutencaoBtn");
    var colocarManutencaoBtn = document.getElementById("colocarManutencaoBtn");

    tirarManutencaoBtn.addEventListener('click', function(){
        atualizarStatusManutencao('remover');
    })

    colocarManutencaoBtn.addEventListener('click', function(){
        atualizarStatusManutencao('colocar');
    })

});

function atualizarStatusManutencao(acao){
    var idTotem = sessionStorage.ID_TOTEM;
    debugger
    fetch(`/dashChartsRoute/atualizarStatusManutencao/${idTotem}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            acao : acao
        })
    })
    .then(function (response){
        if(response.ok){
        return response.json();
        }else{
            throw new error('Erro ao atualizar status de manutenção');
        }
    }).then(function (data){
        console.log('Status de manutenção atualizado com sucesso', data);
    })
    .catch(function (error){
        console.error("Erro:", error);
    })
}
