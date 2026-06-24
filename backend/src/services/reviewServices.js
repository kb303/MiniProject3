const Review = require("../models/reviewModel");
const axios = require("axios");

const createReviewInDB = async (reviewData) => {
  const review = await Review.create(reviewData);
  return review;
};

const getReviewsByShowFromDB = async (showId) => {
  const reviews = await Review.find({ showId }).populate(
    "user",
    "userName userImage",
  );
  return reviews;
};

const getReviewsByUserFromDB = async (userId) => {
  const reviews = await Review.find({ user: userId });

  const enriched = await Promise.all(
    reviews.map(async (review) => {
      const { data: show } = await axios.get(
        `https://api.tvmaze.com/shows/${review.showId}`,
      );
      return {
        ...review.toObject(),
        showName: show.name,
        showImage: show.image?.medium,
      };
    }),
  );

  return enriched;
};

module.exports = {
  createReviewInDB,
  getReviewsByShowFromDB,
  getReviewsByUserFromDB,
};
