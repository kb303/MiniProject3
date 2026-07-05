const {
  createMovieLikeInDB,
  deleteMovieLikeFromDB,
  getMovieLikesByUserFromDB,
  checkMovieLikeExistsInDB,
} = require("../services/movieLikeServices");

const createMovieLike = async (userId, showId) => {
  const like = await createMovieLikeInDB(userId, showId);
  return like;
};

const deleteMovieLike = async (userId, showId) => {
  const deleted = await deleteMovieLikeFromDB(userId, showId);
  if (!deleted) throw new Error("Movie like not found");
  return deleted;
};

const getMovieLikesByUser = async (userId) => {
  return await getMovieLikesByUserFromDB(userId);
};

const checkMovieLikeExists = async (userId, showId) => {
  return await checkMovieLikeExistsInDB(userId, showId);
};

module.exports = {
  createMovieLike,
  deleteMovieLike,
  getMovieLikesByUser,
  checkMovieLikeExists,
};
