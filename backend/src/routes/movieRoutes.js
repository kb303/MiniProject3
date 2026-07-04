const express = require("express");
const router = express.Router();

const movie = require("../controllers/movieController");

router.get("/load", async (req, res) => {
  try {
    await movie.loadMovies();
    res.status(200).send("Movies loaded successfully");
  } catch (error) {
    res.status(500).send("Error loading movies: " + error.message);
  }
});

router.get("/genres", async (req, res) => {
  try {
    const genres = await movie.retrieveGenres();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).send("Error retrieving genres: " + error.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    const movies = await movie.retrieveMovies();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).send("Error retrieving movies: " + error.message);
  }
});

//HERE FOR TESTNG PURPOSES ONLY, SHOULD BE PROTECTED IN PRODUCTION
router.delete("/delete", async (req, res) => {
  try {
    await movie.deleteMovies();
    res.status(200).send("All movies deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting movies: " + error.message);
  }
});

module.exports = router;
