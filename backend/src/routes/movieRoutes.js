const express = require("express");
const router = express.Router();

const movie = require("../controllers/movieController");
const listController = require("../controllers/listController");
const { authenticateToken } = require("../middleware/authMiddleware");

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

router.get("/lists", authenticateToken, async (req, res) => {
  try {
    const lists = await listController.getUserLists(req.user.userId);
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).send("Error retrieving movie lists: " + error.message);
  }
});

router.post("/lists", authenticateToken, async (req, res) => {
  try {
    const list = await listController.createUserList({
      userId: req.user.userId,
      name: req.body.name,
      movieIds: req.body.movieIds ?? [],
    });
    res.status(201).json(list);
  } catch (error) {
    res.status(500).send("Error creating movie list: " + error.message);
  }
});

router.put("/lists/:listId", authenticateToken, async (req, res) => {
  try {
    const updated = await listController.updateUserList(
      req.user.userId,
      req.params.listId,
      req.body,
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).send("Error updating movie list: " + error.message);
  }
});

router.delete("/lists/:listId", authenticateToken, async (req, res) => {
  try {
    const deleted = await listController.deleteUserList(
      req.user.userId,
      req.params.listId,
    );
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).send("Error deleting movie list: " + error.message);
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
