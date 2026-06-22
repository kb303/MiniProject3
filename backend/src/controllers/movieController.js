const { loadDataIntoDB } = require("../services/movieServices");

const loadMovies = async () => {
  await loadDataIntoDB();
};

const deleteMovies = async () => {
  await deleteAllMovies();
};

module.exports = { loadMovies, deleteMovies };
