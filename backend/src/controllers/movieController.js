const {
  loadDataIntoDB,
  getListsFromDB,
  createListInDB,
  addMovieToListInDB,
} = require("../services/movieServices");

const { deleteAllMovies } = require("../services/movieServices");

const loadMovies = async () => {
  await loadDataIntoDB();
};

const getLists = async (userId) => {
  return await getListsFromDB(userId);
};

// For testing purposes only, should be protected in production
const deleteMovies = async () => {
  await deleteAllMovies();
};

const createList = async (userId, listName) => {
  return await createListInDB(userId, listName);
};

const addMovieToList = async (userId, listId, movieId) => {};

module.exports = {
  loadMovies,
  getLists,
  deleteMovies,
  createList,
  addMovieToList,
};
