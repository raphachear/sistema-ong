const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// CONEXÃO MYSQL RAILWAY
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
    console.log("Erro ao conectar:", err);
  } else {
    console.log("MySQL conectado!");
  }

});

// CRIAR TABELA USUARIOS
db.query(`
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100),
  senha VARCHAR(255)
)
`);

// CRIAR TABELA ATENDIDOS
db.query(`
CREATE TABLE IF NOT EXISTS atendidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  sobrenome VARCHAR(100),
  telefone VARCHAR(30),
  cep VARCHAR(20),
  rua VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(100)
)
`);

// ROTA TESTE
app.get("/teste", (req, res) => {
  res.send("API funcionando!");
});

// CRIAR ADMIN
app.get("/criar-admin", async (req, res) => {

  const senhaHash = await bcrypt.hash("123456", 10);

  db.query(
    "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
    ["admin@ong.com", senhaHash],
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
        console.log(err);
        return res.send("Erro no servidor");
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

      res.send("token");

    }
  );

});

// CADASTRAR ATENDIDO
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

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});