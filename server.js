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

db.connect(err => {
  if (err) console.error(err);
  else console.log("MySQL conectado!");
});

// REGISTRO
app.post("/register", async (req, res) => {
  const { email, senha } = req.body;

  const hash = await bcrypt.hash(senha, 10);

  db.query("INSERT INTO usuarios (email, senha) VALUES (?, ?)",
    [email, hash],
    (err) => {
      if (err) return res.status(500).send("Erro");
      res.send("Usuário criado");
    });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, result) => {
    if (result.length === 0) return res.send("Usuário não encontrado");

    const user = result[0];
    const valid = await bcrypt.compare(senha, user.senha);

    if (!valid) return res.send("Senha inválida");

    const token = jwt.sign({ id: user.id }, "segredo");

    res.json({ token });
  });
});

// CADASTRO ATENDIDO
app.post("/atendidos", (req, res) => {
  const {
    nome, sobrenome, telefone, cep, rua,
    bairro, cidade, estado
  } = req.body;

  db.query(
    "INSERT INTO atendidos (nome, sobrenome, telefone, cep, rua, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [nome, sobrenome, telefone, cep, rua, bairro, cidade, estado],
    (err) => {
      if (err) return res.status(500).send("Erro");

      res.send("Atendido cadastrado com sucesso!");
    }
  );
});

app.listen(process.env.PORT || 3000);