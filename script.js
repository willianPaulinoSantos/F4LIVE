let botaoEnviar = document.querySelector(".form__enviar");
let form = document.querySelector("#formulario");
let errosEmail = [];
let errosMensagem = [];
let contatos = [];

botaoEnviar.addEventListener("click", function (event) {
  event.preventDefault();
  let dadosContato = obtemDadosForm(form);
  let formValido = true;
  formValido = validaForm(dadosContato);
  if (formValido) {
    contatos.push(dadosContato.email);
    contatos.push(dadosContato.mensagem);
  }
  console.log(`errosEmail = ${errosEmail}`);
  console.log(`dadosContato = ${contatos}`);
});

function obtemDadosForm(form) {
  let dadosContato = {
    email: form.email.value,
    mensagem: form.mensagem.value
  };
  console.log(`dadosContato no obtem form = ${dadosContato}`);

  return dadosContato;
}

function validaForm(dadosContato) {
  errosEmail = [];
  let emailValido = validaEmail(dadosContato.email);
}

function validaEmail(email) {
  let emailValido = true;
  let usuarioValido = true;
  let dominioValido = true;
  let arrobaIndex;
  let caracteresEspeciais;

  if (email.length === 0) {
    errosEmail.push("Erro no envio (400): por favor inisira um email válido");
    emailValido = false;
    return emailValido;
  } else {
    let arrobaIndex = email.indexOf("@");
    let pontoIndex = email.indexOf(".");
    usuarioValido = validaUsuario(email, arrobaIndex);
    dominioValido = validaDominio(email, arrobaIndex, pontoIndex);
  }
  if (usuarioValido && dominioValido) {
    emailValido = true;
    return emailValido;
  }
  console.log(`usuarioValido = ${usuarioValido}`);
  console.log(`dominioValido = ${dominioValido}`);
  console.log(`errosEmail = ${errosEmail}`);
  console.log(`tamanhoErrosEmail = ${errosEmail.length}`);
}

function validaUsuario(email, arrobaIndex) {
  let validoUsuario = true;
  let caracteresEspeciais = false;
  if (arrobaIndex === -1) {
    errosEmail.push("Erro no envio (400): por favor inisira um email válido");
    //console.log("Erro no envio (400): por favor inisira um email válido");
    validoUsuario = false;
    return validoUsuario;
  }
  if (arrobaIndex > 32 || arrobaIndex < 1) {
    /*  console.log(
      "Erro no envio (401): Nome de usuário incorreto, por favor o nome deve ter entre 1 e 32 caracteres --> usuario@dominio.com"
    );*/
    errosEmail.push(
      "Erro no envio (401): Nome de usuário incorreto, por favor o nome deve ter entre 1 e 32 caracteres --> usuario@dominio.com"
    );

    validoUsuario = false;
    return validoUsuario;
  } else {
    caracteresEspeciais = checaCaracteres(email, 0, arrobaIndex);
    if (caracteresEspeciais) {
      errosEmail.push(
        "Erro no envio (402): caracteres especiais no nome de usuário"
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
  console.log(`tamanho do dominio = ${tamDominio}`);
  console.log(`index arroba = ${arrobaIndex}`);
  console.log(`index ponto = ${pontoIndex}`);

  if (tamDominio > 16 || tamDominio < 1) {
    console.log("Erro no envio (403): Dominio com tamanho Invalido");
  } else {
    contemLetraMaiuscula = checaLetraMaiuscula(email, arrobaIndex, pontoIndex);
    if (contemLetraMaiuscula) {
      console.log(
        `Erro no envio(404): Endereço contendo letras maíusculas no domínio. ContemLetraMaiuscula = ${contemLetraMaiuscula}`
      );
      validoDominio = false;
      return validoDominio;
    }

    let caracteresEspeciais = checaCaracteres(email, arrobaIndex, pontoIndex);
    if (caracteresEspeciais) {
      console.log("Erro no envio: caracteres especiais no nome do dominio");
      validoDominio = false;
      return validoDominio;
    }
  }
  return validoDominio;
}

function checaCaracteres(email, arrobaIndex, pontoIndex) {
  let caracteresEspeciais = false;
  for (let i = arrobaIndex; i < pontoIndex; i++) {
    if (
      email[i] === " " ||
      email[i] === "!" ||
      email[i] === "#" ||
      email[i] === "$" ||
      email[i] === "%" ||
      email[i] === "&" ||
      email[i] === "*"
    ) {
      caracteresEspeciais = true;
      return caracteresEspeciais;
    }
  }
}

function checaLetraMaiuscula(email, arrobaIndex, pontoIndex) {
  let temLetraMaiuscula = false;
  for (let i = arrobaIndex + 1; i < pontoIndex; i++) {
    if (email[i] === email[i].toUpperCase()) {
      temLetraMaiuscula = true;
      return temLetraMaiuscula;
    }
  }
}
