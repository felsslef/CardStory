const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 3000;

// Conexão com o MySQL
const db = mysql.createConnection({
  host: "localhost:3306",
  user: "root",
  password: "P455w0rd111205",
  database: "jogos"
});


db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no DB:", err);
    process.exit(1);
  }
  console.log("Conectado ao banco de dados MySQL");
});

// Endpoint GET /games?tags=tag1,tag2,tag3
app.get("/games", (req, res) => {
  const tagsParam = req.query.tags;
  if (!tagsParam) {
    return res.status(400).json({ error: "Parâmetro 'tags' obrigatório." });
  }

  const tags = tagsParam.split(",").map(t => t.trim().toLowerCase());

  // Query para buscar jogos que possuem todas as tags
  // Usamos GROUP BY e HAVING COUNT para garantir que o jogo tenha todas as tags
  const placeholders = tags.map(() => "?").join(",");
  const sql = `
    SELECT j.id, j.titulo, GROUP_CONCAT(t.nome) AS tags
    FROM jogos j
    JOIN jogos_tags jt ON j.id = jt.jogo_id
    JOIN tags t ON jt.tag_id = t.id
    WHERE LOWER(t.nome) IN (${placeholders})
    GROUP BY j.id
    HAVING COUNT(DISTINCT LOWER(t.nome)) = ?
  `;

  db.query(sql, [...tags, tags.length], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Formatar resultado para { title, tags: [] }
    const formatted = results.map(row => ({
      title: row.titulo,
      tags: row.tags.split(",")
    }));

    res.json(formatted);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});