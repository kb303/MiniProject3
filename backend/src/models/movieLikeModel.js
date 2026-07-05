const mongoose = require("mongoose");

const movieLikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showId: { type: Number, required: true },
  },
  { timestamps: true }
);

movieLikeSchema.index({ user: 1, showId: 1 }, { unique: true });

module.exports = mongoose.model("MovieLike", movieLikeSchema);
