const express = require("express");
const router = express.Router();

const movie = require("../controllers/movieController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/load", async (req, res) => {
  try {
    await movie.loadMovies();
    res.status(200).send("Movies loaded successfully");
  } catch (error) {
    res.status(500).send("Error loading movies: " + error.message);
  }
});

router.get("/lists", authenticateToken, async (req, res) => {
  try {
    const movies = await movie.getLists(req.user.userId);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).send("Error fetching movies: " + error.message);
  }
});

router.post("/lists", authenticateToken, async (req, res) => {
  try {
    const { listName } = req.body;
    if (!listName) {
      return res.status(400).json({ error: "List name is required" });
    }
    const newList = await movie.createList(req.user.userId, listName);
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).send("Error creating list: " + error.message);
  }
});

router.put("/lists/:listId", authenticateToken, async (req, res) => {});

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
