import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import MovieModal from "../components/MovieModal.jsx";
import ActorModal from "../components/ActorModal.jsx";
import Discover from "../pages/Discover.jsx";
import Lists from "../pages/Lists.jsx";
import Liked from "../pages/Liked.jsx";
import Reviews from "../pages/Reviews.jsx";

import { INITIAL_COMMENTS } from "../data/index.js";
import { sortMovies } from "../utils/helpers.js";
import { MovieContext } from "../context/movieContext.jsx";
import { ListContext } from "../context/listContext.jsx";
import { useContext } from "react";

export default function App() {
  const [view, setView] = useState("discover");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set(["succession", "theBear"]));
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorSearch, setActorSearch] = useState("");
  const [likedSort, setLikedSort] = useState("default");
  const [likedGenre, setLikedGenre] = useState("All");
  const [showAddToList, setShowAddToList] = useState(false);

  const {
    sortedFiltered,
    filteredMovies,
    searchQuery,
    setSearchQuery,
    activeGenre,
    setActiveGenre,
    mediaFilter,
    setMediaFilter,
    discoverSort,
    setDiscoverSort,
  } = useContext(MovieContext);

  // Derived data

  const likedMovies = sortMovies(
    filteredMovies.filter(
      (m) =>
        likedIds.has(m.id) &&
        (likedGenre === "All" || m.genres.includes(likedGenre)),
    ),
    likedSort,
  );

  // Handlers
  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedMovie) return;
    const comment = {
      id: Date.now().toString(),
      author: "You",
      initials: "YO",
      text: newComment.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      likes: 0,
    };
    setComments((prev) => ({
      ...prev,
      [selectedMovie.id]: [comment, ...(prev[selectedMovie.id] ?? [])],
    }));
    setNewComment("");
  };

  const {
    lists,
    activeListId,
    setActiveListId,
    showNewList,
    setShowNewList,
    newListName,
    setNewListName,
    listSorts,
    setListSorts,
    toggleMovieInList,
    createList,
    deleteList,
  } = useContext(ListContext);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <Navbar
        view={view}
        setView={setView}
        likedIds={likedIds}
        comments={comments}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pt-16">
        {view === "discover" && (
          <Discover
            featured={sortedFiltered[0] ?? null}
            sortedFiltered={sortedFiltered}
            likedIds={likedIds}
            comments={comments}
            searchQuery={searchQuery}
            mediaFilter={mediaFilter}
            setMediaFilter={setMediaFilter}
            discoverSort={discoverSort}
            setDiscoverSort={setDiscoverSort}
            activeGenre={activeGenre}
            setActiveGenre={setActiveGenre}
            setSelectedMovie={setSelectedMovie}
            toggleLike={toggleLike}
          />
        )}

        {view === "lists" && <Lists setSelectedMovie={setSelectedMovie} />}

        {view === "liked" && (
          <Liked
            likedIds={likedIds}
            likedMovies={likedMovies}
            comments={comments}
            likedSort={likedSort}
            setLikedSort={setLikedSort}
            likedGenre={likedGenre}
            setLikedGenre={setLikedGenre}
            toggleLike={toggleLike}
            setSelectedMovie={setSelectedMovie}
          />
        )}

        {view === "reviews" && (
          <Reviews
            comments={comments}
            searchQuery={searchQuery}
            setSelectedMovie={setSelectedMovie}
          />
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          liked={likedIds.has(selectedMovie.id)}
          onClose={() => {
            setSelectedMovie(null);
            setShowAddToList(false);
          }}
          onToggleLike={() => toggleLike(selectedMovie.id)}
          comments={comments[selectedMovie.id] ?? []}
          onAddComment={addComment}
          newComment={newComment}
          onNewCommentChange={setNewComment}
          lists={lists}
          onToggleList={toggleMovieInList}
          showAddToList={showAddToList}
          onToggleAddToList={() => setShowAddToList((p) => !p)}
          onActorClick={(name) => {
            setSelectedActor(name);
            setShowAddToList(false);
          }}
        />
      )}
    </div>
  );
}
