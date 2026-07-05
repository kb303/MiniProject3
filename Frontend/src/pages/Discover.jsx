import { Film, Eye, Heart, Star } from "lucide-react";
import { useContext } from "react";
import MovieCard from "../components/MovieCard.jsx";
import SortSelect from "../components/SortSelect.jsx";
import { MovieContext } from "../context/movieContext.jsx";
import { backdropUrl } from "../utils/helpers.js";

export default function Discover({
  featured,
  sortedFiltered,
  likedIds,
  searchQuery,
  mediaFilter,
  setMediaFilter,
  discoverSort,
  setDiscoverSort,
  activeGenre,
  setActiveGenre,
  setSelectedMovie,
  toggleLike,
}) {
  const featuredMovie = featured ?? null;
  const { allGenres = [] } = useContext(MovieContext);
  const discoverGenres =
    Array.isArray(allGenres) && allGenres.length > 0 ? allGenres : ["All"];

  return (
    <div>
      {/* Hero */}
      {!searchQuery && featuredMovie && (
        <div className="relative h-[500px] overflow-hidden">
          <img
            src={backdropUrl(featuredMovie.photo)}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-10 pb-12 max-w-[1400px] mx-auto">
            <div className="max-w-md">
              <span className="text-[10px] font-mono tracking-[0.2em] text-primary uppercase mb-3 block">
                Featured Film
              </span>
              <h1
                className="text-7xl font-black leading-none tracking-tight text-foreground mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {featuredMovie.title}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
                {featuredMovie.description}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMovie(featuredMovie)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => toggleLike(featuredMovie.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded border text-sm font-medium transition-colors ${
                    likedIds.has(Number(featuredMovie.id))
                      ? "border-primary/40 text-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${likedIds.has(Number(featuredMovie.id)) ? "fill-current" : ""}`}
                  />
                  {likedIds.has(Number(featuredMovie.id)) ? "Liked" : "Like"}
                </button>
                <div className="flex items-center gap-1.5 text-primary ml-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{featuredMovie.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-[1400px] mx-auto px-6 py-5 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {["all", "movie", "tv"].map((t) => (
              <button
                key={t}
                onClick={() => setMediaFilter(t)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  mediaFilter === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "all" ? "All" : t === "movie" ? "Movies" : "TV Shows"}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <SortSelect value={discoverSort} onChange={setDiscoverSort} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {discoverGenres.slice(0, 11).map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeGenre === g
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        {sortedFiltered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Film className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No titles match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {sortedFiltered.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                liked={likedIds.has(Number(movie.id))}
                onToggleLike={() => toggleLike(movie.id)}
                onOpen={() => setSelectedMovie(movie)}
                commentCount={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
