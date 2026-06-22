const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const showSchema = new Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, trim: true, required: true },
  director: { type: String, trim: true, required: true },
  year: { type: Number, required: true },
  genre: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  poster: { type: String, trim: true },
  rating: { type: Number, min: 0, max: 10 },
  cast: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Show", showSchema);
