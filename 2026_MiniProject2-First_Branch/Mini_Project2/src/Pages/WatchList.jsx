import NavBar from "../Components/NavBar";
import { useContext, useEffect, useState } from "react";
import { MovieContext } from "../Contexts/MovieContext";
import MovieCard from "../Components/MovieCard";

export default function WatchList() {
  const { genreList, getWatchList, watchList, toggleWatchListItem } =
    useContext(MovieContext);
  const [filteredWatchList, setFilteredWatchList] = useState([]);
  const [localSelectedGenre, setLocalSelectedGenre] = useState("All");

  useEffect(() => {
    getWatchList();
  }, []);

  useEffect(() => {
    setFilteredWatchList(watchList);
  }, [watchList]);

  const handleWatchListFilter = (genre, searchTerm = "") => {
    const normalizedGenre = genre || "All";
    setLocalSelectedGenre(normalizedGenre);

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = watchList.filter((movie) => {
      const matchesGenre =
        normalizedGenre === "All" ||
        (movie.genres && movie.genres.includes(normalizedGenre));
      const matchesSearch =
        !lowerSearchTerm || movie.title.toLowerCase().includes(lowerSearchTerm);
      return matchesGenre && matchesSearch;
    });

    setFilteredWatchList(filtered);
  };

  return (
    <>
      <NavBar
        genres={genreList}
        selectedGenre={localSelectedGenre}
        onSelectGenre={handleWatchListFilter}
      />
      <div>
        <h1 className="display-1 m-5 text-center">My Watchlist</h1>
        {watchList.length === 0 ? (
          <p className="text-center">Your watchlist is currently empty.</p>
        ) : filteredWatchList.length === 0 ? (
          <p className="text-center">
            No movies in your watchlist match that filter.
          </p>
        ) : (
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {filteredWatchList.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                description={movie.description}
                imageUrl={movie.imageUrl}
                putInWatchList={() => toggleWatchListItem(movie)}
                isInWatchList={true}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
