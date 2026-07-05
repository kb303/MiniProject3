const express = require("express");
const router = express.Router();

const {
  createMovieLike,
  deleteMovieLike,
  getMovieLikesByUser,
  checkMovieLikeExists,
} = require("../controllers/movieLikeController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Like a movie
router.post("/", authenticateToken, async (req, res) => {
  try {
    const like = await createMovieLike(req.user.userId, req.body.showId);
    res.status(201).json(like);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Already liked this movie" });
    }
    res.status(400).json({ error: err.message });
  }
});

// Unlike a movie
router.delete("/", authenticateToken, async (req, res) => {
  try {
    const deleted = await deleteMovieLike(req.user.userId, req.body.showId);
    res.json({ message: "Unliked", deleted });
  } catch (err) {
    const notFound = err.message === "Movie like not found";
    res.status(notFound ? 404 : 500).json({ error: err.message });
  }
});

// Get all liked showIds for the logged-in user
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const showIds = await getMovieLikesByUser(req.user.userId);
    res.json(showIds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if logged-in user liked a specific movie
router.get("/check/:showId", authenticateToken, async (req, res) => {
  try {
    const liked = await checkMovieLikeExists(
      req.user.userId,
      req.params.showId
    );
    res.json({ liked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
