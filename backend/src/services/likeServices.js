const Like = require("../models/likeModel");

const createLikeInDB = async (userId, reviewId) => {
  const like = await Like.create({ user: userId, review: reviewId });
  return like;
};

const deleteLikeFromDB = async (userId, reviewId) => {
  const deleted = await Like.findOneAndDelete({
    user: userId,
    review: reviewId,
  });
  return deleted;
};

const getLikesByReviewFromDB = async (reviewId) => {
  const likes = await Like.find({ review: reviewId }).populate(
    "user",
    "userName",
  );
  return likes;
};

const checkLikeExistsInDB = async (userId, reviewId) => {
  const like = await Like.findOne({ user: userId, review: reviewId });
  return !!like;
};

module.exports = {
  createLikeInDB,
  deleteLikeFromDB,
  getLikesByReviewFromDB,
  checkLikeExistsInDB,
};
