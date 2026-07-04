const {
  loadDataIntoDB,
  getAllGenres,
  getAllMovies,
} = require("../services/movieServices");

const { deleteAllMovies } = require("../services/movieServices");

const loadMovies = async () => {
  await loadDataIntoDB();
};

const retrieveGenres = async () => {
  const genres = await getAllGenres();
  return genres;
};

const retrieveMovies = async () => {
  const movies = await getAllMovies();
  return movies;
};

// For testing purposes only, should be protected in production
const deleteMovies = async () => {
  await deleteAllMovies();
};

module.exports = { loadMovies, retrieveMovies, retrieveGenres, deleteMovies };
