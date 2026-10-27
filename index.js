const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "movieproject",
});

app.use(express.json());

// GET: Halaman utama API
app.get("/", (req, res) => {
  res.json({
    message: "API MovieList berjalan",
    endpoints: ["/movies", "/movies/:id"],
  });
});

// GET: Menampilkan semua film
app.get("/movies", (req, res) => {
  pool.query("SELECT * FROM movies", (err, rows) => {
    if (err) {
      console.error("Gagal mengambil data film:", err.message);

      return res.status(500).json({
        message: "Gagal mengambil data film",
      });
    }

    res.status(200).json({
      data: rows,
    });
  });
});

// GET: Menampilkan film berdasarkan ID
app.get("/movies/:id", (req, res) => {
  pool.query("SELECT * FROM movies WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({
        message: "Gagal mengambil detail film",
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Film tidak ditemukan",
      });
    }

    res.status(200).json({
      data: rows[0],
    });
  });
});

// DELETE: Menghapus film berdasarkan ID
app.delete("/movies/:id", (req, res) => {
  pool.query("DELETE FROM movies WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({
        message: "Gagal menghapus film",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Film tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Film berhasil dihapus",
    });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API MovieList berjalan di port ${PORT}`);
});
