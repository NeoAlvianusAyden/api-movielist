const express = require("express");
const movies = require("./movies.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "API MovieList berjalan",
    endpoints: ["/movies", "/movies/:id"],
  });
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const movie = movies.find((item) => String(item.id) === req.params.id);

  if (!movie) {
    return res.status(404).json({ message: "Film tidak ditemukan" });
  }

  res.json(movie);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API MovieList berjalan di port ${PORT}`);
});
