const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// CONEXÃO MYSQL
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

    console.log("Erro MySQL:", err);

  } else {

    console.log("MySQL conectado!");

    // APAGAR TABELA ANTIGA
    db.query("DROP TABLE IF EXISTS atendidos", (erroDrop) => {

      if (erroDrop) {

        console.log(erroDrop);

      } else {

        console.log("Tabela antiga removida");

        // CRIAR TABELA NOVA
        db.query(`

          CREATE TABLE atendidos (

            id INT AUTO_INCREMENT PRIMARY KEY,

            nome VARCHAR(100),
            sobrenome VARCHAR(100),

            cpf VARCHAR(30),
            telefone VARCHAR(30),

            cep VARCHAR(20),
            rua VARCHAR(100),
            numero VARCHAR(20),
            complemento VARCHAR(100),

            bairro VARCHAR(100),
            cidade VARCHAR(100),
            estado VARCHAR(100)

          )

        `, (erroCreate) => {

          if (erroCreate) {

            console.log(erroCreate);

          } else {

            console.log("Tabela atendidos criada!");

          }

        });

      }

    });

  }

});

// TESTE API
app.get("/teste", (req, res) => {

  res.send("API funcionando");

});

// CADASTRAR ATENDIDO
app.post("/atendidos", (req, res) => {

  const {

    nome,
    sobrenome,

    cpf,
    telefone,

    cep,
    rua,
    numero,
    complemento,

    bairro,
    cidade,
    estado

  } = req.body;

  db.query(

    `
    INSERT INTO atendidos (

      nome,
      sobrenome,

      cpf,
      telefone,

      cep,
      rua,
      numero,
      complemento,

      bairro,
      cidade,
      estado

    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,

    [

      nome,
      sobrenome,

      cpf,
      telefone,

      cep,
      rua,
      numero,
      complemento,

      bairro,
      cidade,
      estado

    ],

    (erro, resultado) => {

      if (erro) {

        console.log(erro);

        return res.send("Erro ao cadastrar");

      }

      res.send("Atendido cadastrado com sucesso!");

    }

  );

});

// LISTAR ATENDIDOS
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

  console.log("Servidor rodando na porta " + PORT);

});