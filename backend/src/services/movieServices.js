const data = fetch("https://api.tvmaze.com/shows").then((response) =>
  response.json().then((json) => {
    return json;
  }),
);

const checkMovieExists = async (movieId) => {
  const Movie = require("../models/movieModel");
  const movie = await Movie.findOne({ id: movieId });
  return !!movie;
};

const loadDataIntoDB = async () => {
  const movies = await data;
  const existingMovies = await Promise.all(
    movies.map((movie) => checkMovieExists(movie.id)),
  );
  const newMovies = movies.filter((_, index) => !existingMovies[index]);
  const Movie = require("../models/movieModel");
  await Movie.insertMany(newMovies);
};

// For testing purposes only, should be protected in production
const deleteAllMovies = async () => {
  const Movie = require("../models/movieModel");
  await Movie.deleteMany({});
};

module.exports = { loadDataIntoDB, checkMovieExists, deleteAllMovies };
