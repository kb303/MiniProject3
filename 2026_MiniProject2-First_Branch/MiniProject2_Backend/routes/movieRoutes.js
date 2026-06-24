const express = require("express");
const router = express.Router();

const {
  displayAllShows,
  getGenres,
  filteredShows,
  getWatchList,
  addToWatchList,
  removeFromWatchList,
} = require("../controllers/movieController");

router.get("/api/movies", async (req, res) => {
  const movies = await displayAllShows();
  res.json(movies);
});

router.get("/api/genres", async (req, res) => {
  const genres = await getGenres();
  res.json(genres);
});

router.get("/api/movies/filter", async (req, res) => {
  const { genre, searchTerm } = req.query;
  const filteredMovies = await filteredShows(genre, searchTerm);
  res.json(filteredMovies);
});

router.get("/api/movies/watchlist", async (req, res) => {
  const watchList = await getWatchList();
  res.json(watchList);
});

router.post("/api/movies/watchlist", async (req, res) => {
  const { movieId } = req.body;
  const movie = await addToWatchList(movieId);
  if (movie) {
    res.json({ success: true, movie });
  } else {
    res.status(404).json({ success: false, error: "Movie not found" });
  }
});

router.delete("/api/movies/watchlist/:movieId", async (req, res) => {
  const { movieId } = req.params;
  const removedMovie = await removeFromWatchList(Number(movieId));
  if (removedMovie) {
    res.json({ success: true, movie: removedMovie });
  } else {
    res
      .status(404)
      .json({ success: false, error: "Movie not found in watchlist" });
  }
});

module.exports = router;
