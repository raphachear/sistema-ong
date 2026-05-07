const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "roundhouse.proxy.rlwy.net",
  user: "root",
  password: "FaJhwkZcSpsIDBZIhKjJIvbrFvaZngmZ",
  database: "railway",
  port: 20614
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL conectado!");
  }
});

// CRIA TABELA USUARIOS
db.query(`
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100),
  senha VARCHAR(255)
)
`);

// CRIA TABELA ATENDIDOS
db.query(`
CREATE TABLE IF NOT EXISTS atendidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  sobrenome VARCHAR(100),
  telefone VARCHAR(20),
  cep VARCHAR(20),
  rua VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(50)
)
`);

// CRIAR ADMIN
app.get("/criar-admin", async (req, res) => {

  const senha = await bcrypt.hash("123456", 10);

  db.query(
    "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
    ["admin@ong.com", senha],
    (err) => {

      if (err) {
        console.log(err);
        return res.send("Erro ao criar admin");
      }

      res.send("Admin criado!");
    }
  );

});

// LOGIN
app.post("/login", (req, res) => {

  const { email, senha } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, result) => {

      if (err) {
        return res.send("Erro");
      }

      if (result.length === 0) {
        return res.send("Usuário não encontrado");
      }

      const usuario = result[0];

      const senhaCorreta = await bcrypt.compare(
        senha,
        usuario.senha
      );

      if (!senhaCorreta) {
        return res.send("Senha inválida");
      }

      const token = jwt.sign(
        { id: usuario.id },
        "segredo"
      );

      res.json({ token });

    }
  );

});

// CADASTRO DE ATENDIDOS
app.post("/atendidos", (req, res) => {

  const {
    nome,
    sobrenome,
    telefone,
    cep,
    rua,
    bairro,
    cidade,
    estado
  } = req.body;

  db.query(
    `
    INSERT INTO atendidos
    (nome, sobrenome, telefone, cep, rua, bairro, cidade, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      nome,
      sobrenome,
      telefone,
      cep,
      rua,
      bairro,
      cidade,
      estado
    ],
    (err) => {

      if (err) {
        console.log(err);
        return res.send("Erro ao cadastrar");
      }

      res.send("Atendido cadastrado com sucesso!");

    }
  );

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
});