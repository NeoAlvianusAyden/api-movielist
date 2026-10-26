const express = require("express");

const app = express();
const PORT = 3000;

// Middleware untuk membaca JSON
app.use(express.json());

// Data film manual
let movies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    genre: "Drama",
    rating: 9.3,
    releaseYear: 1994,
    synopsis: "Seorang bankir berusaha mempertahankan harapan dan membangun kehidupan baru selama menjalani hukuman penjara.",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  },
  {
    id: 2,
    title: "Catch Me If You Can",
    genre: "Crime, Drama",
    rating: 8.1,
    releaseYear: 2002,
    synopsis: "Kisah seorang pemuda yang melakukan berbagai penipuan identitas dan dikejar oleh seorang agen FBI.",
    poster: "https://image.tmdb.org/t/p/w500/ctjEj2xM32OvBXCq8zAdK3ZrsAj.jpg",
  },
  {
    id: 3,
    title: "Finding Nemo",
    genre: "Animation, Adventure",
    rating: 8.3,
    releaseYear: 2003,
    synopsis: "Seekor ikan badut melakukan perjalanan melintasi lautan untuk menemukan anaknya yang hilang.",
    poster: "https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
  },
  {
    id: 4,
    title: "Inception",
    genre: "Action, Sci-Fi",
    rating: 8.8,
    releaseYear: 2010,
    synopsis: "Seorang pencuri memasuki mimpi orang lain untuk mengambil informasi dan menjalankan misi yang rumit.",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 5,
    title: "Interstellar",
    genre: "Adventure, Drama, Sci-Fi",
    rating: 8.7,
    releaseYear: 2014,
    synopsis: "Sekelompok penjelajah melakukan perjalanan melalui ruang angkasa untuk mencari masa depan bagi umat manusia.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
];

// GET: Halaman utama API
app.get("/", (req, res) => {
  res.json({
    message: "API MovieList berhasil berjalan",
    endpoints: ["GET /movies", "GET /movies/:id", "POST /movies", "PUT /movies/:id", "DELETE /movies/:id"],
  });
});

// GET: Mengambil semua film
app.get("/movies", (req, res) => {
  res.json({
    total: movies.length,
    data: movies,
  });
});

// GET: Mengambil film berdasarkan ID
app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "ID film harus berupa angka positif",
    });
  }

  const movie = movies.find((item) => item.id === id);

  if (!movie) {
    return res.status(404).json({
      message: "Film tidak ditemukan",
    });
  }

  res.json({ data: movie });
});

// POST: Menambahkan film baru
app.post("/movies", (req, res) => {
  const { title, genre, rating, releaseYear, synopsis, poster } = req.body;

  if (typeof title !== "string" || !title.trim() || typeof genre !== "string" || !genre.trim() || typeof synopsis !== "string" || !synopsis.trim()) {
    return res.status(400).json({
      message: "Judul, genre, dan sinopsis wajib diisi",
    });
  }

  if (typeof rating !== "number" || rating < 0 || rating > 10) {
    return res.status(400).json({
      message: "Rating harus berupa angka dari 0 sampai 10",
    });
  }

  if (!Number.isInteger(releaseYear) || releaseYear < 1888 || releaseYear > new Date().getFullYear() + 10) {
    return res.status(400).json({
      message: "Tahun rilis tidak valid",
    });
  }

  if (poster !== undefined && typeof poster !== "string") {
    return res.status(400).json({
      message: "Poster harus berupa URL dalam bentuk teks",
    });
  }

  const newMovie = {
    id: movies.length ? Math.max(...movies.map((item) => item.id)) + 1 : 1,
    title: title.trim(),
    genre: genre.trim(),
    rating,
    releaseYear,
    synopsis: synopsis.trim(),
    poster: poster || "",
  };

  movies.push(newMovie);

  res.status(201).json({
    message: "Film berhasil ditambahkan",
    data: newMovie,
  });
});

// PUT: Memperbarui film berdasarkan ID
app.put("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((item) => item.id === id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "ID film harus berupa angka positif",
    });
  }

  if (!movie) {
    return res.status(404).json({
      message: "Film tidak ditemukan",
    });
  }

  const { title, genre, rating, releaseYear, synopsis, poster } = req.body;

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    return res.status(400).json({
      message: "Judul tidak boleh kosong",
    });
  }

  if (genre !== undefined && (typeof genre !== "string" || !genre.trim())) {
    return res.status(400).json({
      message: "Genre tidak boleh kosong",
    });
  }

  if (rating !== undefined && (typeof rating !== "number" || rating < 0 || rating > 10)) {
    return res.status(400).json({
      message: "Rating harus berupa angka dari 0 sampai 10",
    });
  }

  if (releaseYear !== undefined && (!Number.isInteger(releaseYear) || releaseYear < 1888 || releaseYear > new Date().getFullYear() + 10)) {
    return res.status(400).json({
      message: "Tahun rilis tidak valid",
    });
  }

  if (synopsis !== undefined && (typeof synopsis !== "string" || !synopsis.trim())) {
    return res.status(400).json({
      message: "Sinopsis tidak boleh kosong",
    });
  }

  if (poster !== undefined && typeof poster !== "string") {
    return res.status(400).json({
      message: "Poster harus berupa URL dalam bentuk teks",
    });
  }

  if (title !== undefined) movie.title = title.trim();
  if (genre !== undefined) movie.genre = genre.trim();
  if (rating !== undefined) movie.rating = rating;
  if (releaseYear !== undefined) movie.releaseYear = releaseYear;
  if (synopsis !== undefined) movie.synopsis = synopsis.trim();
  if (poster !== undefined) movie.poster = poster;

  res.json({
    message: "Film berhasil diperbarui",
    data: movie,
  });
});

// DELETE: Menghapus film berdasarkan ID
app.delete("/movies/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "ID film harus berupa angka positif",
    });
  }

  const index = movies.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Film tidak ditemukan",
    });
  }

  const deletedMovie = movies.splice(index, 1)[0];

  res.json({
    message: "Film berhasil dihapus",
    data: deletedMovie,
  });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`API MovieList berjalan di http://localhost:${PORT}`);
});
