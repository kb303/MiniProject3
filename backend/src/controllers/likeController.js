const {
  createLikeInDB,
  deleteLikeFromDB,
  getLikesByReviewFromDB,
  checkLikeExistsInDB,
} = require("../services/likeServices");

const createLike = async (userId, reviewId) => {
  const like = await createLikeInDB(userId, reviewId);
  return like;
};

const deleteLike = async (userId, reviewId) => {
  const deleted = await deleteLikeFromDB(userId, reviewId);
  if (!deleted) {
    throw new Error("Like not found");
  }
  return deleted;
};

const getLikesByReview = async (reviewId) => {
  const likes = await getLikesByReviewFromDB(reviewId);
  return likes;
};

const checkLikeExists = async (userId, reviewId) => {
  const liked = await checkLikeExistsInDB(userId, reviewId);
  return liked;
};

module.exports = { createLike, deleteLike, getLikesByReview, checkLikeExists };
