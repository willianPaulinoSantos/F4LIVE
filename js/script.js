let botaoEnviar = document.querySelector(".form__enviar");
let form = document.querySelector("#formulario");
//let errosEmail = [];
let mensagemUsuario = [];
let contatos = [];

botaoEnviar.addEventListener("click", function (event) {
  event.preventDefault();
  mensagemUsuario = [];
  let dadosContato = obtemDadosForm(form);
  let formValido = true;
  formValido = validaForm(dadosContato);
  console.log(formValido);
  if (formValido) {
    let nomeUsuario = selecionaNomeUsuario(dadosContato.email);
    contatos.push(dadosContato);
    mensagemUsuario.push(`Obrigado pelo contato ${nomeUsuario}!`);
    exibeMensagem(mensagemUsuario);
    console.log(mensagemUsuario);
    return;
  }
  exibeMensagem(mensagemUsuario);
});

function obtemDadosForm(form) {
  let dadosContato = {
    email: form.email.value,
    mensagem: form.mensagem.value
  };
  return dadosContato;
}

function selecionaNomeUsuario(email) {
  let indexArroba = email.indexOf("@");
  let nomeUsuario = email.slice(0, indexArroba);
  return nomeUsuario;
}

function validaForm(dadosContato) {
  mensagemUsuario = [];
  let formValido = true;
  let emailValido = validaEmail(dadosContato.email);
  let mensagemValida = validaMensagemUsuario(dadosContato.mensagem);
  if (!emailValido || !mensagemValida) {
    formValido = false;
  }
  return formValido;
}

function validaEmail(email) {
  let emailValido = true;
  let estruturaValida = true;
  let usuarioValido = true;
  let dominioValido = true;
  let regiaoEmail;
  let arrobaIndex;
  let pontoIndex;

  if (email.length === 0) {
    mensagemUsuario.push(
      "Erro no envio (w01): por favor inisira um email válido"
    );
    emailValido = false;
    return emailValido;
  } else {
    estruturaValida = validaEstruturaEmail(email, estruturaValida);
    if (!estruturaValida) {
      emailValido = false;
      return emailValido;
    } else {
      arrobaIndex = email.indexOf("@");
      let estruturaUsuario = /(\w||\W)+@/g;
      let usuario = email.match(estruturaUsuario).toString();
      console.log(usuario.length);
      pontoIndex = email.indexOf(".", usuario.length);
      console.log(pontoIndex);
      regiaoEmail = "usuario";
      usuarioValido = validaUsuario(email, arrobaIndex, regiaoEmail);
      if (!usuarioValido) {
        emailValido = false;
        return emailValido;
      } else {
        dominioValido = validaDominio(email, arrobaIndex, pontoIndex);
      }
    }
  }

  if (usuarioValido && dominioValido) {
    emailValido = true;
    return emailValido;
  }
}

function validaEstruturaEmail(email, estruturaValida) {
  let estruturaEmail = /\w||\W+@+\w||\W+\.+\w||\W+\w||\W/g;
  let procuraEstrutura = email.match(estruturaEmail);
  if (!procuraEstrutura) {
    mensagemUsuario.push("Erro no envio: inisira um endereço válido");
    estruturaValida = false;
    return estruturaValida;
  } else {
    return estruturaValida;
  }
}

function validaUsuario(email, arrobaIndex, regiaoEmail) {
  let validoUsuario = true;
  let caracteresEspeciais = false;
  if (arrobaIndex === -1) {
    mensagemUsuario.push(
      "Erro no envio (w02): por favor inisira um email válido, contendo @"
    );
    validoUsuario = false;
    return validoUsuario;
  }
  if (arrobaIndex > 32 || arrobaIndex < 1) {
    mensagemUsuario.push(
      "Erro no envio (w03): Nome de usuário incorreto, por favor o usuário deve ter entre 1 e 32 caracteres --> usuario@dominio.com"
    );
    validoUsuario = false;
    return validoUsuario;
  } else {
    caracteresEspeciais = checaCaracteres(
      email,
      0,
      arrobaIndex - 1,
      regiaoEmail
    );
    if (caracteresEspeciais) {
      mensagemUsuario.push(
        "Erro no envio (w04): caracteres especiais no nome de usuário"
      );
      validoUsuario = false;
      return validoUsuario;
    }
  }
  return validoUsuario;
}

function validaDominio(email, arrobaIndex, pontoIndex) {
  let tamDominio = pontoIndex - arrobaIndex - 1;
  let validoDominio = true;
  let contemLetraMaiuscula = false;

  if (tamDominio > 16 || tamDominio < 1) {
    mensagemUsuario.push("Erro no envio (w05): Dominio com tamanho invalido");
    validoDominio = false;
    return validoDominio;
  } else {
    let caracteresEspeciais = checaCaracteres(
      email,
      arrobaIndex + 1,
      pontoIndex
    );
    if (caracteresEspeciais) {
      mensagemUsuario.push(
        "Erro no envio (w07): caracteres especiais no nome do dominio"
      );
      validoDominio = false;
      return validoDominio;
    }
    contemLetraMaiuscula = checaLetraMaiuscula(email, arrobaIndex, pontoIndex);
    if (contemLetraMaiuscula) {
      mensagemUsuario.push(
        `Erro no envio(w06): Endereço contendo letras maíusculas no domínio.`
      );
      validoDominio = false;
      return validoDominio;
    }
  }
  return validoDominio;
}

function checaCaracteres(email, arrobaIndex, pontoIndex, regiaoEmail) {
  let caracteresEspeciais = false;
  let caracteresEspc = /\W/g;
  let ponto = /\./g;
  let procuraCaract;
  let procuraPonto;
  if (regiaoEmail === "usuario") {
    for (let i = arrobaIndex; i < pontoIndex; i++) {
      procuraCaract = [];
      procuraPonto = [];
      procuraCaract = email[i].match(caracteresEspc);
      procuraPonto = email[i].match(ponto);
      console.log(
        `procura caract = ${procuraCaract}, procura ponto = ${procuraPonto}, negação procura ponto = ${!procuraPonto}`
      );
      if (procuraCaract) {
        if (!procuraPonto) {
          if (procuraCaract !== procuraPonto) {
            caracteresEspeciais = true;
          }
        }
      }
    }
    return caracteresEspeciais;
  } else {
    for (let i = arrobaIndex; i < pontoIndex; i++) {
      procuraCaract = [];
      procuraCaract = email[i].match(caracteresEspc);
      if (procuraCaract) {
        caracteresEspeciais = true;
      }
    }
    return caracteresEspeciais;
  }
}

function checaLetraMaiuscula(email, arrobaIndex, pontoIndex) {
  let temLetraMaiuscula = false;
  let digitos = /\d/g;
  for (let i = arrobaIndex + 1; i < pontoIndex; i++) {
    let procuraDigitos = [];
    procuraDigitos = email[i].match(digitos);
    if (procuraDigitos !== null) {
      if (procuraDigitos.length === 0 && email[i] === email[i].toUpperCase()) {
        temLetraMaiuscula = true;
        return temLetraMaiuscula;
      }
    } else {
      if (email[i] === email[i].toUpperCase()) {
        temLetraMaiuscula = true;
        return temLetraMaiuscula;
      }
    }
  }
}

function validaMensagemUsuario(mensagem) {
  let mensagemValida = true;
  if (mensagem === "") {
    mensagemUsuario.push("\nErro no envio (w08): Insira uma mensagem");
    mensagemValida = false;
  }
  return mensagemValida;
}

function exibeMensagem(mensagemUsuario) {
  let p = document.querySelector(".mensagemUsuario");
  p.innerHTML = "";
  p.textContent = mensagemUsuario;
}
