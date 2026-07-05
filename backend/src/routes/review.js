const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getReviewsByShow,
  getReviewsByUser,
} = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Get all reviews (with like counts) — used by the Reviews page
router.get("/", async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new review (auth required)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const review = await createReview(req.user.userId, req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get reviews for a specific show
router.get("/show/:showId", async (req, res) => {
  try {
    const showId = Number(req.params.showId);
    const reviews = await getReviewsByShow(showId);
    res.json(reviews);
  } catch (err) {
    const isBadRequest = err.message === "showId must be a number";
    res.status(isBadRequest ? 400 : 500).json({ error: err.message });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const reviews = await getReviewsByUser(req.user.userId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
