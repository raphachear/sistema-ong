const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// CONEXÃO MYSQL (RAILWAY)
const db = mysql.createConnection({
  host: "roundhouse.proxy.rlwy.net",
  user: "root",
  password: "FaJhwkZcSpsIDBZIhKjJIvbrFvaZngmZ",
  database: "railway",
  port: 20614
});

// NÃO DEIXA O SERVIDOR QUEBRAR
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

db.on("error", (err) => {
  console.error("Erro no MySQL:", err);
});

// ROTA DE TESTE
app.get("/teste", (req, res) => {
  res.send("API funcionando!");
});

// CADASTRO
app.post("/voluntarios", (req, res) => {
  const { nome, cpf, email } = req.body;

  const sql = "INSERT INTO voluntarios (nome, cpf, email) VALUES (?, ?, ?)";

  db.query(sql, [nome, cpf, email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao cadastrar");
    }

    res.send("Voluntário cadastrado com sucesso!");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});