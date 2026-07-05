import { useState, useContext } from "react";
import Navbar from "../components/Navbar.jsx";
import MovieModal from "../components/MovieModal.jsx";
import ActorModal from "../components/ActorModal.jsx";
import Discover from "../pages/Discover.jsx";
import Lists from "../pages/Lists.jsx";
import Liked from "../pages/Liked.jsx";
import Reviews from "../pages/Reviews.jsx";

import { sortMovies } from "../utils/helpers.js";
import { MovieContext } from "../context/movieContext.jsx";
import { MovieLikeContext } from "../context/movieLikeContext.jsx";

export default function App() {
  const [view, setView] = useState("discover");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorSearch, setActorSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [discoverSort, setDiscoverSort] = useState("default");
  const [likedSort, setLikedSort] = useState("default");
  const [likedGenre, setLikedGenre] = useState("All");
  const [showAddToList, setShowAddToList] = useState(false);

  const { sortedFiltered, filteredMovies, allMovies } = useContext(MovieContext);
  const { likedIds, toggleMovieLike } = useContext(MovieLikeContext);

  // Derive liked movies for the Liked page
  const likedMovies = sortMovies(
    filteredMovies.filter(
      (m) =>
        likedIds.has(Number(m.id)) &&
        (likedGenre === "All" || m.genres.includes(likedGenre))
    ),
    likedSort
  );

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <Navbar
        view={view}
        setView={setView}
        likedIds={likedIds}
        setActorSearch={setActorSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pt-16">
        {view === "discover" && (
          <Discover
            featured={sortedFiltered[0] ?? null}
            sortedFiltered={sortedFiltered}
            likedIds={likedIds}
            searchQuery={searchQuery}
            mediaFilter={mediaFilter}
            setMediaFilter={setMediaFilter}
            discoverSort={discoverSort}
            setDiscoverSort={setDiscoverSort}
            activeGenre={activeGenre}
            setActiveGenre={setActiveGenre}
            setSelectedMovie={setSelectedMovie}
            toggleLike={toggleMovieLike}
          />
        )}

        {view === "lists" && <Lists setSelectedMovie={setSelectedMovie} />}

        {view === "liked" && (
          <Liked
            likedIds={likedIds}
            likedMovies={likedMovies}
            likedSort={likedSort}
            setLikedSort={setLikedSort}
            likedGenre={likedGenre}
            setLikedGenre={setLikedGenre}
            toggleLike={toggleMovieLike}
            setSelectedMovie={setSelectedMovie}
          />
        )}

        {view === "reviews" && (
          <Reviews
            searchQuery={searchQuery}
            setSelectedMovie={setSelectedMovie}
          />
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          liked={likedIds.has(Number(selectedMovie.id))}
          onClose={() => {
            setSelectedMovie(null);
            setShowAddToList(false);
          }}
          onToggleLike={() => toggleMovieLike(selectedMovie.id)}
          showAddToList={showAddToList}
          onToggleAddToList={() => setShowAddToList((p) => !p)}
          onActorClick={(name) => {
            setSelectedActor(name);
            setShowAddToList(false);
          }}
        />
      )}

      {selectedActor && (
        <ActorModal
          actorName={selectedActor}
          movies={allMovies.filter((m) => m.cast?.includes(selectedActor))}
          onClose={() => setSelectedActor(null)}
          onMovieClick={(movie) => {
            setSelectedActor(null);
            setSelectedMovie(movie);
          }}
          likedIds={likedIds}
          onToggleLike={toggleMovieLike}
        />
      )}
    </div>
  );
}
