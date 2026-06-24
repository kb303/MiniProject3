const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
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

module.exports = mongoose.model("Movie", movieSchema);

/* id: "oppenheimer", title: "Oppenheimer", year: 2023, type: "movie",
    genres: ["Drama", "History"], rating: 8.9, runtime: "3h 0m",
    description: "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the paradox of a man celebrated as a hero and later persecuted as a traitor.",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    photo: "1626814026136-4ead5c2d3cca",*/
