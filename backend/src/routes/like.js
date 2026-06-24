const express = require("express");
const router = express.Router();

const {
  createLike,
  deleteLike,
  getLikesByReview,
  checkLikeExists,
} = require("../controllers/likeController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const like = await createLike(req.user.userId, req.body.review);
    res.status(201).json(like);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Already liked this review" });
    }
    res.status(400).json({ error: err.message });
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    const { review } = req.body;
    const deleted = await deleteLike(req.user.userId, review);
    res.json({ message: "Unliked", deleted });
  } catch (err) {
    const notFound = err.message === "Like not found";
    res.status(notFound ? 404 : 500).json({ error: err.message });
  }
});

router.get("/review/:reviewId", async (req, res) => {
  try {
    const likes = await getLikesByReview(req.params.reviewId);
    res.json({ count: likes.length, likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/check/:reviewId", authenticateToken, async (req, res) => {
  try {
    const liked = await checkLikeExists(req.user.userId, req.params.reviewId);
    res.json({ liked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
