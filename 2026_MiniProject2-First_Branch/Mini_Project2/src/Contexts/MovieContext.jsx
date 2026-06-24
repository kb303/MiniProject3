import { createContext, useReducer, useEffect, useState } from "react";
import axios from "axios";

export const MovieContext = createContext();

const movieReducer = (state, action) => {
  switch (action.type) {
    case "LoadMovies":
      return [...action.payload];
    case "LoadGenres":
      return [...action.payload];
    default:
      return state;
  }
};

export default function MovieProvider({ children }) {
  const [movieList, dispatch] = useReducer(movieReducer, []);
  const [genreList, dispatchGenre] = useReducer(movieReducer, []);
  const [watchList, setWatchList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch genres from the API and update the genre list state
  const getGenres = async () => {
    const response = await axios.get("/api/genres");
    const action = { type: "LoadGenres", payload: response.data };
    dispatchGenre(action);
  };

  // Fetch filtered shows based on the selected genre and search term
  const filterShowsByGenre = async (genre, searchTerm = "") => {
    const normalizedGenre = genre || "All";
    setSelectedGenre(normalizedGenre);
    const response = await axios.get("/api/movies/filter", {
      params: { genre: normalizedGenre, searchTerm },
    });
    const action = { type: "LoadMovies", payload: response.data };
    dispatch(action);
  };

  // Fetch all movies and genres when the component mounts
  useEffect(() => {
    const getMovies = async () => {
      const response = await axios.get("/api/movies");
      const action = { type: "LoadMovies", payload: response.data };
      dispatch(action);
    };
    getMovies();
    getGenres();
    getWatchList();
  }, []);

  //  Reload the page to reset all states and fetch the original list of movies

  const seeMoreDetails = (movieId) => {
    const movie = movieList.find((movie) => movie.id === movieId);
    if (movie) {
      setSelectedMovie(movie);
    }
  };

  const getWatchList = async () => {
    const response = await axios.get("/api/movies/watchlist");
    setWatchList(Array.isArray(response.data) ? response.data : []);
    return Array.isArray(response.data) ? response.data : [];
  };

  const isMovieInWatchList = (movieId) => {
    return watchList.some((movie) => movie.id === movieId);
  };

  const addToWatchList = async (movie) => {
    try {
      await axios.post("/api/movies/watchlist", { movieId: movie.id });
      await getWatchList();
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  const removeFromWatchList = async (movie) => {
    try {
      await axios.delete(`/api/movies/watchlist/${movie.id}`);
      await getWatchList();
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  const toggleWatchListItem = async (movie) => {
    if (isMovieInWatchList(movie.id)) {
      await removeFromWatchList(movie);
    } else {
      await addToWatchList(movie);
    }
  };

  const clearSelectedMovie = () => {
    setSelectedMovie(null);
  };

  return (
    <MovieContext.Provider
      value={{
        movieList,
        dispatch,
        genreList,
        dispatchGenre,
        getGenres,
        filterShowsByGenre,
        selectedGenre,
        setSelectedGenre,
        selectedMovie,
        clearSelectedMovie,
        seeMoreDetails,
        getWatchList,
        watchList,
        isMovieInWatchList,
        addToWatchList,
        removeFromWatchList,
        toggleWatchListItem,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
