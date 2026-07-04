const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, trim: true, required: true },
  movieIds: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("List", listSchema);
