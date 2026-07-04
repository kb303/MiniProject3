const data = fetch("https://api.tvmaze.com/shows").then((response) =>
  response.json().then((json) => {
    return json;
  }),
);

const normalizeMovie = (movie) => {
  const title = movie?.name ?? movie?.title ?? "Untitled";
  const year = Number(movie?.premiered?.slice(0, 4) ?? movie?.year ?? 0);
  const genre =
    Array.isArray(movie?.genres) && movie.genres.length > 0
      ? movie.genres[0]
      : "Drama";
  const rawRating = Number(movie?.rating?.average ?? movie?.rating ?? 0);
  const rating = Number.isFinite(rawRating) ? rawRating : 0;
  const description = movie?.summary?.replace(/<[^>]*>/g, "") ?? "";
  const poster = movie?.image?.original ?? movie?.image?.medium ?? "";
  const cast = Array.isArray(movie?.cast)
    ? movie.cast.map((person) => person?.person?.name).filter(Boolean)
    : [];

  return {
    id: movie?.id?.toString() ?? title.toLowerCase().replace(/\s+/g, "-"),
    title,
    director: movie?.network?.name ?? "Unknown",
    year,
    genre,
    description,
    poster,
    rating,
    cast,
  };
};

const checkMovieExists = async (movieId) => {
  const Movie = require("../models/movieModel");
  const movie = await Movie.findOne({ id: movieId });
  return !!movie;
};

const loadDataIntoDB = async () => {
  const movies = await data;
  const normalizedMovies = movies.map(normalizeMovie);
  const existingMovies = await Promise.all(
    normalizedMovies.map((movie) => checkMovieExists(movie.id)),
  );
  const newMovies = normalizedMovies.filter(
    (_, index) => !existingMovies[index],
  );
  const Movie = require("../models/movieModel");
  await Movie.insertMany(newMovies);
};

// For testing purposes only, should be protected in production
const deleteAllMovies = async () => {
  const Movie = require("../models/movieModel");
  await Movie.deleteMany({});
};

const getAllMovies = async () => {
  const Movie = require("../models/movieModel");
  const movies = await Movie.find({});
  return movies;
};

const getAllGenres = async () => {
  const Movie = require("../models/movieModel");
  const genres = await Movie.distinct("genres");
  return genres;
};

module.exports = {
  loadDataIntoDB,
  checkMovieExists,
  deleteAllMovies,
  getAllMovies,
  getAllGenres,
};
