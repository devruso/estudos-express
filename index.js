const express = require("express");
const fs = require("fs");
const CPF = require("cpf");
const { usuarios } = require("./usuarios");

// Define uma aplicação backend em Express
// Recursos pré-configurados
const app = express();

// Define um roteamento
// Manipulador de rota
app.get("/", (requisicao, resposta) => {
  resposta.send("<h2>Batata!!!!</h2>");
});

// req = requisicao do cliente
// res = resposta do servidor
app.get("/teste", (req, res) => {
  // manipulador de rota
  // req = objeto com dados do cliente/solicitante
  // res = objeto com dados p/ resposta do servidor
  res.send("<p>O que deseja amigo?</p>");
});

app.get("/inicio", (req, res) => {
  const arquivo = fs.readFileSync("./inicio.html");
  res.send(arquivo.toString());
});

app.get("/ajuda", (req, res) => {
  const arquivo = fs.readFileSync("./ajuda.html");
  res.send(arquivo.toString());
});

// Parâmetro de caminho/rota
app.get("/funcionarios/:cpf", (req, res) => {
  // req.params = guarda todos os parametros de rota
  // const cpf = req.params.cpf;
  const { cpf } = req.params;
    // Por padrão status é 200
  CPF.isValid(cpf) ? res.send("O cpf é válido!") : res.status(400).send("O cpf é inválido!");

});

app.get("/pessoas/:nome/:empresa", (req, res) => {
  // const nome = req.params.nome;
  // const empresa = req.params.empresa;
  const { nome, empresa } = req.params;
  res.send(`${nome} e ${empresa}`);
});

app.get("/imc/:peso/:altura", (req, res) => {
  const peso = Number(req.params.peso);
  const altura = Number(req.params.altura);
  const imc = peso / altura ** 2;

  res.send(`<p>IMC: ${imc.toFixed(2)}</p>`);
});

app.get("/cpfs/:numero", (req, res) => {
  const numero = Number(req.params.numero);

  for (let i = 0; i < numero; i++) {
    res.write(`<p>${CPF.generate()}</p>`);
  }
  res.end();
});
app.get("/nome/", (req, res) => {
    const {nome} = req.query;
    if(nome){
        res.send(`Olá, ${nome}`);
    }else{
        res.status(400).send("Envie o nome corretamente")
    }
})

app.get("/soma/", (req,res) => {
    let {num1, num2} = req.query;

    if(num1 && num2){
        const soma = Number(num1) + Number(num2);
        res.send(`Soma : ${soma}`)
    }else{
        res.status(400).send("Forneça números válidos");
    }
})

app.get("/boasvindas", (req,res) =>{
    const {lang} = req.query;

    if(lang === "pt"){
        res.send("Bem vindo")
        
    }else if(lang === "en"){
        res.send("Welcome!")
    }else{
        res.status(400).send("Linguagem não suportada")
    }
})


app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});
//Usando query
//Query não é obrigatório  escrever os dados.
app.get("/usuarios/novo", (req,res) =>{
  const {nome, email} = req.query;

  const novoUsuario = {nome: nome, email: email};
  usuarios.push(novoUsuario);
  res.status(201).json({message: "Usuario adicionado"});
})
//Usando params
app.get("/usuarios/email/:email", (req,res) =>{
  const {email} = req.params;
  const usuarioEncontrado = usuarios.find(el => email === el.email);
  if(usuarioEncontrado){
    res.json(usuarioEncontrado)
  }else{
    res.status(404).send({message : "Usuario não encontrado"});
  }
})

app.get("/usuarios/:index", (req, res) => {
  const index = Number(req.params.index);
  const usuarioEncontrado = usuarios[index];

  // Tratar a ausência do usuário
  if (usuarioEncontrado) {
    res.json(usuarioEncontrado);
  } else {
    // Not Found = 404
    res.status(404).json({ message: "Usuário não encontrado" });
  }
})






// Inicializa a escuta de requisições do servidor
app.listen(3000, () => {
  // roda sempre que o servidor inicia com sucesso
  console.log("Servidor rodando em http://localhost:3000/");
});

