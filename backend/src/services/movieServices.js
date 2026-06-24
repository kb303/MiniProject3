const data = fetch("https://api.tvmaze.com/shows").then((response) =>
  response.json().then((json) => {
    return json;
  }),
);

const list = require("../models/listModel");

const checkMovieExists = async (movieId) => {
  const Movie = require("../models/movieModel");
  const movie = await Movie.findOne({ id: movieId });
  return !!movie;
};

function normalizeShows(raw) {
  if (!raw) return [];
  if (!Array.isArray(raw)) return [];
  // If search endpoint was used, items look like { score, show }
  if (raw.length > 0 && raw[0].show) {
    return raw.map((item) => item.show || null).filter(Boolean);
  }
  return raw;
}

/*
const displayAllShows = async () => {
  const raw = await data;
  const shows = normalizeShows(raw);
  return shows
    .map((show) => {
      const year = dateFormat(show.premiered);
      if (year === null) return null;
      return {
        id: show.id,
        title: show.name,
        description: show.summary,
        imageUrl: show.image?.medium || "",
      };
    })
    .filter(Boolean);
};*/

//TODO : figure error with dateFormat
const loadDataIntoDB = async () => {
  const raw = await data;
  const movies = normalizeShows(raw);

  const existingMovies = await Promise.all(
    movies.map((movie) => checkMovieExists(movie.id)),
  );
  const newMovies = movies.filter((_, index) => !existingMovies[index]);
  const Movie = require("../models/movieModel");
  await Movie.insertMany(newMovies);
};

const getListsFromDB = async (userId) => {
  const list = require("../models/listModel");
  const lists = await list.find({ user: userId });
  return lists;
};

const createListInDB = async (userId, listName) => {
  const list = require("../models/listModel");
  const newList = new list({ user: userId, name: listName, movies: [] });
  await newList.save();
  return newList;
};

const addMovieToListInDB = async (userId, listId, movieId) => {
  const Movie = require("../models/movieModel");
  const addedMovie = await Movie.findOne({ id: movieId });
  if (!addedMovie) {
    throw new Error("Movie not found");
  }
  const list = await list.findById(listId);
  if (!list) {
    throw new Error("List not found");
  }
  list.movies.push(addedMovie._id);
  await list.save();
};

// For testing purposes only, should be protected in production
const deleteAllMovies = async () => {
  const Movie = require("../models/movieModel");
  await Movie.deleteMany({});
};

module.exports = {
  loadDataIntoDB,
  checkMovieExists,
  addMovieToListInDB,
  getListsFromDB,
  createListInDB,
  deleteAllMovies,
};
