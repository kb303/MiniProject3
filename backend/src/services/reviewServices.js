const Review = require("../models/reviewModel");
const axios = require("axios");
const Like = require("../models/likeModel");

const getLikeCountMap = async (reviewIds) => {
  const likeCounts = await Like.aggregate([
    { $match: { review: { $in: reviewIds } } },
    { $group: { _id: "$review", count: { $sum: 1 } } },
  ]);
  const map = {};
  likeCounts.forEach((lc) => {
    map[lc._id.toString()] = lc.count;
  });
  return map;
};

const createReviewInDB = async (reviewData) => {
  const review = await Review.create(reviewData);
  await review.populate("user", "username userImage");
  return review;
};

const getAllReviewsFromDB = async () => {
  const reviews = await Review.find({})
    .populate("user", "username userImage")
    .lean();
  const reviewIds = reviews.map((r) => r._id);
  const likeCountMap = await getLikeCountMap(reviewIds);
  return reviews.map((r) => ({
    ...r,
    likeCount: likeCountMap[r._id.toString()] ?? 0,
  }));
};

const getReviewsByShowFromDB = async (showId) => {
  const reviews = await Review.find({ showId })
    .populate("user", "username userImage")
    .lean();
  const reviewIds = reviews.map((r) => r._id);
  const likeCountMap = await getLikeCountMap(reviewIds);
  return reviews.map((r) => ({
    ...r,
    likeCount: likeCountMap[r._id.toString()] ?? 0,
  }));
};

const getReviewsByUserFromDB = async (userId) => {
  const reviews = await Review.find({ user: userId })
    .populate("user", "username userImage")
    .lean();
  const reviewIds = reviews.map((r) => r._id);
  const likeCountMap = await getLikeCountMap(reviewIds);
  return reviews.map((r) => ({
    ...r,
    likeCount: likeCountMap[r._id.toString()] ?? 0,
  }));
};

module.exports = {
  createReviewInDB,
  getAllReviewsFromDB,
  getReviewsByShowFromDB,
  getReviewsByUserFromDB,
};
