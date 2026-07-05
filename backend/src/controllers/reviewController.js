const {
  createReviewInDB,
  getAllReviewsFromDB,
  getReviewsByShowFromDB,
  getReviewsByUserFromDB,
} = require("../services/reviewServices");

const createReview = async (userId, reviewBody) => {
  const review = await createReviewInDB({ ...reviewBody, user: userId });
  return review;
};

const getAllReviews = async () => {
  return await getAllReviewsFromDB();
};

const getReviewsByShow = async (showId) => {
  if (isNaN(showId)) {
    throw new Error("showId must be a number");
  }
  const reviews = await getReviewsByShowFromDB(showId);
  return reviews;
};

const getReviewsByUser = async (userId) => {
  const reviews = await getReviewsByUserFromDB(userId);
  return reviews;
};

module.exports = { createReview, getAllReviews, getReviewsByShow, getReviewsByUser };