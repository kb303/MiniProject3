const { loadDataIntoDB } = require("../services/movieServices");

const { deleteAllMovies } = require("../services/movieServices");

const loadMovies = async () => {
  await loadDataIntoDB();
};

// For testing purposes only, should be protected in production
const deleteMovies = async () => {
  await deleteAllMovies();
};

module.exports = { loadMovies, deleteMovies };
