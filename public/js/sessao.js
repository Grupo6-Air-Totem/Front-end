function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var nomeEmpresa = sessionStorage.NOME_EMPRESA;
    var nomeUser = sessionStorage.NOME_USUARIO;
    var nivelAcesso = sessionStorage.NIVEL_ACESSO;
    var idEmpresa = sessionStorage.ID_EMPRESA;
    var idAero = sessionStorage.AEROPORTO_ID;

    var spanEmpresa = document.getElementById("nome_empresa");
    var b_usuario = document.getElementById("b_usuario");

    
    console.log(idAero)
    console.log("passou aquiii");
    
    spanEmpresa.innerHTML = nomeEmpresa;
    console.log(spanEmpresa);


    if (email != null && nome != null) {
        b_usuario.innerHTML = nivelAcesso;
    } else {
        window.location = "./dashboard/dashGerente.html";
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

// function finalizarAguardar(texto) {
//     var divAguardar = document.getElementById("div_aguardar");
//     divAguardar.style.display = "none";

//     var divErrosLogin = document.getElementById("div_erros_login");
//     if (texto) {
//         divErrosLogin.style.display = "flex";
//         divErrosLogin.innerHTML = texto;
//     }
// }

