import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { sortMovies } from "../utils/helpers.js";
import { MOVIES, GENRES } from "../data/index.js";

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

const normalizeMovies = (payload) => {
  if (!Array.isArray(payload)) return [];

  return payload.map((movie) => ({
    id: movie.id ?? movie._id ?? movie.slug ?? "",
    title: movie.title ?? movie.name ?? "Untitled",
    year: movie.year ?? movie.premiered?.slice(0, 4) ?? 0,
    type: movie.type ?? (movie.genre === "Drama" ? "movie" : "tv"),
    genres: Array.isArray(movie.genres)
      ? movie.genres
      : typeof movie.genre === "string"
        ? [movie.genre]
        : [],
    rating: movie.rating?.average ?? movie.rating ?? 0,
    runtime: movie.runtime ?? movie.runTime ?? "",
    description: movie.description ?? movie.summary ?? "",
    director: movie.director ?? "",
    cast: Array.isArray(movie.cast) ? movie.cast : [],
    photo: movie.photo ?? movie.poster ?? movie.image?.medium ?? "",
    ...movie,
  }));
};

const normalizeGenres = (payload) => {
  if (!Array.isArray(payload)) return [];
  return payload.flatMap((item) => {
    if (Array.isArray(item)) return item;
    if (typeof item === "string") return [item];
    if (typeof item?.name === "string") return [item.name];
    return [];
  });
};

export function MovieProvider({ children }) {
  const [discoverSort, setDiscoverSort] = useState("default");
  const [activeGenre, setActiveGenre] = useState("All");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [allMovies, dispatchAllMovies] = useReducer(movieReducer, []);
  const [allGenres, dispatchAllGenres] = useReducer(movieReducer, []);

  const getMovies = async () => {
    try {
      const response = await axios.get("/api/movies/all");
      const movies = normalizeMovies(response.data ?? []);
      const action = {
        type: "LoadMovies",
        payload: movies.length > 0 ? movies : MOVIES,
      };
      dispatchAllMovies(action);
    } catch (error) {
      console.error("Failed to load movies", error);
      dispatchAllMovies({ type: "LoadMovies", payload: MOVIES });
    }
  };

  const getGenres = async () => {
    try {
      const response = await axios.get("/api/movies/genres");
      const genres = normalizeGenres(response.data ?? []);
      const action = {
        type: "LoadGenres",
        payload: genres.length > 0 ? genres : GENRES,
      };
      dispatchAllGenres(action);
    } catch (error) {
      console.error("Failed to load genres", error);
      dispatchAllGenres({ type: "LoadGenres", payload: GENRES });
    }
  };

  useEffect(() => {
    void getMovies();
    void getGenres();
  }, []);

  const filteredMovies = allMovies.filter((m) => {
    const title = typeof m?.title === "string" ? m.title : "";
    const genres = Array.isArray(m?.genres) ? m.genres : [];
    const type = typeof m?.type === "string" ? m.type : "";

    const matchesSearch = title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenre = activeGenre === "All" || genres.includes(activeGenre);
    const matchesMedia = mediaFilter === "all" || type === mediaFilter;

    return matchesSearch && matchesGenre && matchesMedia;
  });

  const sortedFiltered = sortMovies(filteredMovies, discoverSort);

  return (
    <MovieContext.Provider
      value={{
        sortedFiltered,
        getGenres,
        getMovies,
        filteredMovies,
        discoverSort,
        setDiscoverSort,
        activeGenre,
        setActiveGenre,
        mediaFilter,
        setMediaFilter,
        searchQuery,
        setSearchQuery,
        selectedMovie,
        setSelectedMovie,
        allGenres,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
