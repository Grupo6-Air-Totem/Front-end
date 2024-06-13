async function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var nomeEmpresa = sessionStorage.NOME_EMPRESA;
    var nivelAcesso = sessionStorage.NIVEL_ACESSO;
    var idAero = sessionStorage.AEROPORTO_ID;
    var totalTotemEmp = sessionStorage.TOTAL_TOTENS_EMPRESA;
    var totalManu = sessionStorage.TOTAL_TOTENS_MANUTENCAO;
    var totalAtivo = sessionStorage.TOTAL_TOTENS_ATIVOS;
    var totalInativo = sessionStorage.TOTAL_TOTENS_INATIVOS;


    var spanEmpresa = document.getElementById("nome_empresa");
    var qtdTotalTotens = document.getElementById("totalEmpresa")
    var qtdTotemManu = document.getElementById("totens_manutencao");
    var qtdTotemAtv = document.getElementById("totens_ativos");
    var qtdTotemInt = document.getElementById("totens_inativo");
    var b_usuario = document.getElementById("b_usuario");
    var porcentAtivoSpan = document.getElementById("porcent_Ativo");
    var porcentInativoSpan = document.getElementById("porcent_Inativo");
    var porcentManutencaoSpan = document.getElementById("porcent_manutencao");

    function roundUpToOneDecimal(num) {
        return Math.ceil(num * 10) / 10;
    }

    const porcentA = roundUpToOneDecimal((totalAtivo / totalTotemEmp) * 100);
    const porcentI = roundUpToOneDecimal((totalInativo / totalTotemEmp) * 100);
    const porcentM = roundUpToOneDecimal((totalManu / totalTotemEmp) * 100);

    spanEmpresa.innerHTML = nomeEmpresa;
    qtdTotalTotens.innerHTML = totalTotemEmp;
    qtdTotemManu.innerHTML = totalManu;
    qtdTotemAtv.innerHTML = totalAtivo;
    qtdTotemInt.innerHTML = totalInativo;


    porcentAtivoSpan.innerHTML = porcentA.toFixed(0) + "% do total de totens";
    porcentInativoSpan.innerHTML = porcentI.toFixed(0) + "% do total de totens";
    porcentManutencaoSpan.innerHTML = porcentM.toFixed(0) + "% do total de totens";

    qtdTotalTotens.style.color = "#3478C7";
    qtdTotemManu.style.color = "#3478C7";
    qtdTotemAtv.style.color = "#3478C7";
    qtdTotemInt.style.color = "#3478C7";
    
    console.log(idAero)
    console.log("passou aquiii");


    if (email != null && nome != null) {
        b_usuario.innerHTML = nivelAcesso;
    } 
    
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}

function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
}

function validarSessaoTerminal(){

    var terminal = sessionStorage.ID_TERMINAL;
    var totalTerminal = sessionStorage.TOTAL_TOTEM_TER;
    var totalManu = sessionStorage.TOTAL_TOTENS_MANU;
    var totalAtivo = sessionStorage.TOTAL_TOTENS_ATIVOS;
    var totalInativo = sessionStorage.TOTAL_TOTENS_INATIVOS;
    
    console.log("TERMINAL: ", terminal)
    console.log("TOTAL TERMINAL: ", totalTerminal)

    var spanTerminal = document.getElementById("terminal_id");
    var qtdTotalTerminal = document.getElementById("total_totens_terminal");
    var empresa = document.getElementById("nome_empresa");

    empresa.innerHTML = sessionStorage.NOME_EMPRESA;
    spanTerminal.innerHTML = "Terminal " + terminal;
    qtdTotalTerminal.innerHTML = totalTerminal;
    // qtdTotalAtivo.innerHTML = totalAtivo;
    // qtdTotalInativo.innerHTML = totalInativo;
    // qtdTotalTerminal.innerHTML = totalTerminal;
    // qtdTotalManu.innerHTML = totalManu;  

}

