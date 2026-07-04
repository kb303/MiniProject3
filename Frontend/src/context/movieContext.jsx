import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { sortMovies } from "../utils/helpers.js";

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
  const genres = payload.flatMap((item) => {
    if (Array.isArray(item)) return item;
    if (typeof item === "string") return [item];
    if (typeof item?.name === "string") return [item.name];
    return [];
  });

  return [...new Set(genres.map((genre) => String(genre).trim()).filter(Boolean))];
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
        payload: movies,
      };
      dispatchAllMovies(action);
    } catch (error) {
      console.error("Failed to load movies", error);
      dispatchAllMovies({ type: "LoadMovies", payload: [] });
    }
  };

  const getGenres = async () => {
    try {
      const response = await axios.get("/api/movies/genres");
      const genres = normalizeGenres(response.data ?? []);
      const action = {
        type: "LoadGenres",
        payload: ["All", ...genres.filter((genre) => genre !== "All")],
      };
      dispatchAllGenres(action);
    } catch (error) {
      console.error("Failed to load genres", error);
      dispatchAllGenres({ type: "LoadGenres", payload: ["All"] });
    }
  };

  const getMovieLists = async () => {
    try {
      const response = await axios.get("/api/movies/lists");
      const lists = response.data ?? [];
      return lists;
    } catch (error) {
      console.error("Failed to load movie lists", error);
      return [];
    }
  };

  const createMovieList = async (listName, movieIds) => {
    try {
      const payload = { name: listName, movieIds };
      const response = await axios.post("/api/movies/lists", payload);
      return response.data ?? null;
    } catch (error) {
      console.error("Failed to create movie list", error);
      return null;
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
        allMovies,
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
