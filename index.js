const express = require("express");
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "movieproject",
});
const app = express();
const PORT = 3000;

// Middleware untuk membaca JSON
app.use(express.json());

// GET: Halaman utama API
app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query("SELECT * from movies", (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.status(200).json({ data: rows });
      } else {
        res.status(500).json({ error: err });
      }
    });
  });
});

app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * FROM movies WHERE id = ?", [req.params.id], (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.status(200).json({ data: rows });
      } else {
        res.status(500).json({ error: err });
      }
    });
  });
});

app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("DELETE FROM movies WHERE id = ?", [req.params.id], (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.status(200).json({ data: rows });
      } else {
        res.status(500).json({ error: err });
      }
    });
  });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`API MovieList berjalan di http://localhost:${PORT}`);
});
