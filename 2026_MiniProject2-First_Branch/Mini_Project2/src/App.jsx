import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MovieContext } from "./Contexts/MovieContext";

import MovieRoutes from "./Routes/MovieRoutes";

function App() {
  const {
    movieList,
    genreList,
    selectedGenre,
    filterShowsByGenre,
    reloadPage,
    seeMoreDetails,
    selectedMovie,
    clearSelectedMovie,
  } = useContext(MovieContext);

  return (
    <>
      <MovieRoutes />
    </>
  );
}

export default App;
