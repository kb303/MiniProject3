import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import MovieModal from "../components/MovieModal.jsx";
import ActorModal from "../components/ActorModal.jsx";
import Discover from "../pages/Discover.jsx";
import Actors from "../pages/Actors.jsx";
import Lists from "../pages/Lists.jsx";
import Liked from "../pages/Liked.jsx";
import Reviews from "../pages/Reviews.jsx";
import { MOVIES, INITIAL_COMMENTS, INITIAL_LISTS } from "../data/index.js";
import { sortMovies, getActorMovies } from "../utils/helpers.js";

export default function App() {
  const [view, setView] = useState("discover");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set(["succession", "theBear"]));
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [newComment, setNewComment] = useState("");
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorSearch, setActorSearch] = useState("");
  const [discoverSort, setDiscoverSort] = useState("default");
  const [likedSort, setLikedSort] = useState("default");
  const [likedGenre, setLikedGenre] = useState("All");
  const [listSorts, setListSorts] = useState({});
  const [showAddToList, setShowAddToList] = useState(false);
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [activeListId, setActiveListId] = useState(INITIAL_LISTS[0].id);

  // Derived data
  const filteredMovies = MOVIES.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = activeGenre === "All" || m.genres.includes(activeGenre);
    const matchesMedia = mediaFilter === "all" || m.type === mediaFilter;
    return matchesSearch && matchesGenre && matchesMedia;
  });
  const sortedFiltered = sortMovies(filteredMovies, discoverSort);
  const likedMovies = sortMovies(
    MOVIES.filter((m) => likedIds.has(m.id) && (likedGenre === "All" || m.genres.includes(likedGenre))),
    likedSort
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
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      likes: 0,
    };
    setComments((prev) => ({ ...prev, [selectedMovie.id]: [comment, ...(prev[selectedMovie.id] ?? [])] }));
    setNewComment("");
  };

  const toggleMovieInList = (listId, movieId) => {
    setLists((prev) =>
      prev.map((l) => {
        if (l.id !== listId) return l;
        const has = l.movieIds.includes(movieId);
        return { ...l, movieIds: has ? l.movieIds.filter((id) => id !== movieId) : [...l.movieIds, movieId] };
      })
    );
  };

  const createList = () => {
    if (!newListName.trim()) return;
    const list = { id: Date.now().toString(), name: newListName.trim(), movieIds: [] };
    setLists((prev) => [...prev, list]);
    setNewListName("");
    setShowNewList(false);
    setActiveListId(list.id);
  };

  const deleteList = (listId) => {
    const remaining = lists.filter((l) => l.id !== listId);
    setLists(remaining);
    if (activeListId === listId) setActiveListId(remaining[0]?.id ?? "");
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar
        view={view}
        setView={setView}
        likedIds={likedIds}
        comments={comments}
        actorSearch={actorSearch}
        setActorSearch={setActorSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pt-16">
        {view === "discover" && (
          <Discover
            featured={MOVIES[0]}
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

        {view === "actors" && (
          <Actors
            actorSearch={actorSearch}
            setSelectedActor={setSelectedActor}
          />
        )}

        {view === "lists" && (
          <Lists
            lists={lists}
            activeListId={activeListId}
            setActiveListId={setActiveListId}
            showNewList={showNewList}
            setShowNewList={setShowNewList}
            newListName={newListName}
            setNewListName={setNewListName}
            createList={createList}
            deleteList={deleteList}
            listSorts={listSorts}
            setListSorts={setListSorts}
            toggleMovieInList={toggleMovieInList}
            setSelectedMovie={setSelectedMovie}
          />
        )}

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
          onClose={() => { setSelectedMovie(null); setShowAddToList(false); }}
          onToggleLike={() => toggleLike(selectedMovie.id)}
          comments={comments[selectedMovie.id] ?? []}
          onAddComment={addComment}
          newComment={newComment}
          onNewCommentChange={setNewComment}
          lists={lists}
          onToggleList={toggleMovieInList}
          showAddToList={showAddToList}
          onToggleAddToList={() => setShowAddToList((p) => !p)}
          onActorClick={(name) => { setSelectedActor(name); setShowAddToList(false); }}
        />
      )}

      {selectedActor && (
        <ActorModal
          actorName={selectedActor}
          movies={getActorMovies(selectedActor)}
          onClose={() => setSelectedActor(null)}
          onMovieClick={(movie) => { setSelectedActor(null); setSelectedMovie(movie); }}
          likedIds={likedIds}
          onToggleLike={toggleLike}
        />
      )}
    </div>
  );
}
