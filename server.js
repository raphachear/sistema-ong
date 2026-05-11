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

  if (err) {

    console.log(err);

  } else {

    console.log("MySQL conectado!");

    // APAGAR TABELA ANTIGA
    db.query("DROP TABLE IF EXISTS atendidos", (erroDrop) => {

      if (erroDrop) {

        console.log(erroDrop);

      } else {

        console.log("Tabela antiga removida");

        // CRIAR NOVA TABELA
        db.query(`

          CREATE TABLE atendidos (

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

        `, (erroCreate) => {

          if (erroCreate) {

            console.log(erroCreate);

          } else {

            console.log("Tabela criada!");

          }

        });

      }

    });

  }

});

// TESTE
app.get("/teste", (req, res) => {

  res.send("API funcionando");

});

// CADASTRAR
app.post("/atendidos", (req, res) => {

  const dados = req.body;

  const atendido = {

    nome: dados.nome,
    filiacao: dados.filiacao,

    nascimento: dados.nascimento,
    sexo: dados.sexo,
    estado_civil: dados.estado_civil,
    naturalidade: dados.naturalidade,

    cor: dados.cor,

    telefone1: dados.telefone1,
    telefone2: dados.telefone2,

    cep: dados.cep,
    rua: dados.rua,
    numero: dados.numero,
    complemento: dados.complemento,

    bairro: dados.bairro,
    cidade: dados.cidade,
    estado: dados.estado,

    referencia: dados.referencia,
    motivo: dados.motivo,

    rg: dados.rg,
    cpf: dados.cpf,
    titulo_eleitor: dados.titulo_eleitor,

    zona: dados.zona,
    secao: dados.secao,

    carteira_trabalho: dados.carteira_trabalho,

    certidao: dados.certidao,

    programa_federal: dados.programa_federal,
    assistencia: dados.assistencia,

    situacao_profissional: dados.situacao_profissional,
    tempo_desempregado: dados.tempo_desempregado,

    composicao_familiar: JSON.stringify(
      dados.composicao_familiar || []
    ),

    renda_familiar: dados.renda_familiar,

    situacao_habitacional: dados.situacao_habitacional,
    tempo_moradia: dados.tempo_moradia,
    comodos: dados.comodos,

    tipo_construcao: dados.tipo_construcao,

    abastecimento_agua: dados.abastecimento_agua,

    iluminacao: dados.iluminacao,

    medicamentos: dados.medicamentos,
    gas: dados.gas,
    alimentacao: dados.alimentacao,
    contas: dados.contas,
    outras_despesas: dados.outras_despesas,
    total_despesas: dados.total_despesas,

    saude_familia: JSON.stringify(
      dados.saude_familia || []
    ),

    fumante: dados.fumante,
    fumante_quem: dados.fumante_quem,

    alcoolista: dados.alcoolista,
    alcoolista_quem: dados.alcoolista_quem,

    drogas: dados.drogas,
    drogas_quem: dados.drogas_quem,

    observacoes: dados.observacoes

  };

  db.query(

    "INSERT INTO atendidos SET ?",

    atendido,

    (erro) => {

      if (erro) {

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

      if (erro) {

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