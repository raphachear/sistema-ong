const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

// CADASTRO REAL
app.post("/voluntarios", (req, res) => {
  const { nome, cpf, email } = req.body;

  const sql = "INSERT INTO voluntarios (nome, cpf, email) VALUES (?, ?, ?)";

  db.query(sql, [nome, cpf, email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao cadastrar");
    }

res.send("TESTE 123");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});