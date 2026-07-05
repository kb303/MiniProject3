const MovieLike = require("../models/movieLikeModel");

const createMovieLikeInDB = async (userId, showId) => {
  const like = await MovieLike.create({ user: userId, showId: Number(showId) });
  return like;
};

const deleteMovieLikeFromDB = async (userId, showId) => {
  const deleted = await MovieLike.findOneAndDelete({
    user: userId,
    showId: Number(showId),
  });
  return deleted;
};

const getMovieLikesByUserFromDB = async (userId) => {
  const likes = await MovieLike.find({ user: userId });
  return likes.map((l) => l.showId);
};

const checkMovieLikeExistsInDB = async (userId, showId) => {
  const like = await MovieLike.findOne({ user: userId, showId: Number(showId) });
  return !!like;
};

module.exports = {
  createMovieLikeInDB,
  deleteMovieLikeFromDB,
  getMovieLikesByUserFromDB,
  checkMovieLikeExistsInDB,
};
