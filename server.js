const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use(express.static(path.join(__dirname, "public")));

// MYSQL
const db = mysql.createConnection({

  host: "roundhouse.proxy.rlwy.net",
  user: "root",
  password: "FaJhwkZcSpsIDBZIhKjJIvbrFvaZngmZ",
  database: "railway",
  port: 20614

});

// CONECTAR MYSQL
db.connect((err) => {

  if(err){

    console.log(err);

  } else {

    console.log("MySQL conectado!");

    // TABELA
    db.query(`

      CREATE TABLE IF NOT EXISTS atendidos (

        id INT AUTO_INCREMENT PRIMARY KEY,

        nome VARCHAR(255),
        filiacao VARCHAR(255),

        nascimento VARCHAR(100),
        sexo VARCHAR(20),
        estado_civil VARCHAR(100),
        naturalidade VARCHAR(100),

        cor VARCHAR(100),

        telefone1 VARCHAR(50),
        telefone2 VARCHAR(50),

        cep VARCHAR(20),
        rua VARCHAR(255),
        numero VARCHAR(50),
        complemento VARCHAR(255),

        bairro VARCHAR(255),
        cidade VARCHAR(255),
        estado VARCHAR(255),

        referencia TEXT,
        motivo TEXT,

        rg VARCHAR(100),
        cpf VARCHAR(100),
        titulo_eleitor VARCHAR(100),

        zona VARCHAR(50),
        secao VARCHAR(50),

        carteira_trabalho VARCHAR(100),

        certidao VARCHAR(100),

        programa_federal VARCHAR(255),
        assistencia VARCHAR(255),

        situacao_profissional VARCHAR(255),
        tempo_desempregado VARCHAR(100),

        composicao_familiar LONGTEXT,

        renda_familiar VARCHAR(100),

        situacao_habitacional VARCHAR(255),
        tempo_moradia VARCHAR(100),
        comodos VARCHAR(100),

        tipo_construcao VARCHAR(255),

        abastecimento_agua VARCHAR(255),

        iluminacao VARCHAR(255),

        medicamentos VARCHAR(100),
        gas VARCHAR(100),
        alimentacao VARCHAR(100),
        contas VARCHAR(100),
        outras_despesas TEXT,
        total_despesas VARCHAR(100),

        saude_familia LONGTEXT,

        fumante VARCHAR(50),
        fumante_quem VARCHAR(255),

        alcoolista VARCHAR(50),
        alcoolista_quem VARCHAR(255),

        drogas VARCHAR(50),
        drogas_quem VARCHAR(255),

        observacoes LONGTEXT,

        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      )

    `);

  }

});

// TESTE
app.get("/teste", (req, res) => {

  res.send("API funcionando");

});

// CADASTRAR
app.post("/atendidos", (req, res) => {

  const dados = req.body;

  db.query(

    `
    INSERT INTO atendidos (

      nome,
      filiacao,

      nascimento,
      sexo,
      estado_civil,
      naturalidade,

      cor,

      telefone1,
      telefone2,

      cep,
      rua,
      numero,
      complemento,

      bairro,
      cidade,
      estado,

      referencia,
      motivo,

      rg,
      cpf,
      titulo_eleitor,

      zona,
      secao,

      carteira_trabalho,

      certidao,

      programa_federal,
      assistencia,

      situacao_profissional,
      tempo_desempregado,

      composicao_familiar,

      renda_familiar,

      situacao_habitacional,
      tempo_moradia,
      comodos,

      tipo_construcao,

      abastecimento_agua,

      iluminacao,

      medicamentos,
      gas,
      alimentacao,
      contas,
      outras_despesas,
      total_despesas,

      saude_familia,

      fumante,
      fumante_quem,

      alcoolista,
      alcoolista_quem,

      drogas,
      drogas_quem,

      observacoes

    )

    VALUES (

      ?,?,?,?,?,?,
      ?,?,?,
      ?,?,?,?,
      ?,?,?,
      ?,?,
      ?,?,?,
      ?,?,
      ?,
      ?,
      ?,?,
      ?,?,
      ?,
      ?,
      ?,?,?,
      ?,
      ?,
      ?,?,?,?,?,
      ?,
      ?,?,
      ?,?,
      ?,?,
      ?

    )
    `,

    [

      dados.nome,
      dados.filiacao,

      dados.nascimento,
      dados.sexo,
      dados.estado_civil,
      dados.naturalidade,

      dados.cor,

      dados.telefone1,
      dados.telefone2,

      dados.cep,
      dados.rua,
      dados.numero,
      dados.complemento,

      dados.bairro,
      dados.cidade,
      dados.estado,

      dados.referencia,
      dados.motivo,

      dados.rg,
      dados.cpf,
      dados.titulo_eleitor,

      dados.zona,
      dados.secao,

      dados.carteira_trabalho,

      dados.certidao,

      dados.programa_federal,
      dados.assistencia,

      dados.situacao_profissional,
      dados.tempo_desempregado,

      JSON.stringify(dados.composicao_familiar),

      dados.renda_familiar,

      dados.situacao_habitacional,
      dados.tempo_moradia,
      dados.comodos,

      dados.tipo_construcao,

      dados.abastecimento_agua,

      dados.iluminacao,

      dados.medicamentos,
      dados.gas,
      dados.alimentacao,
      dados.contas,
      dados.outras_despesas,
      dados.total_despesas,

      JSON.stringify(dados.saude_familia),

      dados.fumante,
      dados.fumante_quem,

      dados.alcoolista,
      dados.alcoolista_quem,

      dados.drogas,
      dados.drogas_quem,

      dados.observacoes

    ],

    (erro) => {

      if(erro){

        console.log(erro);

        return res.send("Erro ao cadastrar");

      }

      res.send("Cadastro realizado com sucesso!");

    }

  );

});

// LISTAR
app.get("/atendidos", (req, res) => {

  db.query(

    "SELECT * FROM atendidos ORDER BY id DESC",

    (erro, resultado) => {

      if(erro){

        console.log(erro);

        return res.json([]);

      }

      res.json(resultado);

    }

  );

});

// SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Servidor rodando");

});