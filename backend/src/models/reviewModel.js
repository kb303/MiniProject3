const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showId: { type: Number, required: true },
    title: { type: String, maxlength: 100 },
    reviewDescription: { type: String },
    rating: { type: Number, min: 1, max: 10 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
