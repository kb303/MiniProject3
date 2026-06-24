import NavBar from "../Components/NavBar";
import Movies from "../Components/Movies";
import MoreMovieDetails from "../Components/MoreMovieDetails";
import { useContext } from "react";
import { MovieContext } from "../Contexts/MovieContext";

export default function HomePage() {
  const {
    genreList,
    selectedGenre,
    filterShowsByGenre,
    movieList,
    seeMoreDetails,
    selectedMovie,
    clearSelectedMovie,
    addToWatchList,
    toggleWatchListItem,
    watchList,
  } = useContext(MovieContext);

  return (
    <>
      <NavBar
        genres={genreList}
        selectedGenre={selectedGenre}
        onSelectGenre={filterShowsByGenre}
      />
      <Movies
        movies={movieList}
        watchList={watchList}
        onMoreDetails={seeMoreDetails}
        putInWatchList={toggleWatchListItem}
      />
      {selectedMovie && (
        <MoreMovieDetails
          title={selectedMovie.title}
          description={selectedMovie.description}
          imageUrl={selectedMovie.imageUrl}
          onClose={clearSelectedMovie}
        />
      )}
    </>
  );
}
