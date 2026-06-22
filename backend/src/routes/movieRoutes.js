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
