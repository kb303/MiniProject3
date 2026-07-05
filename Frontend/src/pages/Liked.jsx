import { Heart, Film } from "lucide-react";
import MovieCard from "../components/MovieCard.jsx";
import SortSelect from "../components/SortSelect.jsx";
import { GENRES } from "../data/index.js";

export default function Liked({
  likedIds, likedMovies,
  likedSort, setLikedSort, likedGenre, setLikedGenre,
  toggleLike, setSelectedMovie,
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1
            className="text-5xl font-black leading-none mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LIKED
          </h1>
          <p className="text-muted-foreground text-sm">
            {likedMovies.length} title{likedMovies.length !== 1 ? "s" : ""}
            {likedGenre !== "All" ? ` in ${likedGenre}` : " you've liked"}
          </p>
        </div>
        <SortSelect value={likedSort} onChange={setLikedSort} />
      </div>

      {/* Genre filter */}
      <div className="flex items-center gap-2 flex-wrap mb-7">
        {GENRES.slice(0, 11).map((g) => (
          <button
            key={g}
            onClick={() => setLikedGenre(g)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              likedGenre === g
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {likedIds.size === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl text-muted-foreground">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">You haven't liked anything yet.</p>
          <p className="text-xs mt-1 opacity-60">
            Hit the heart on any title to like it.
          </p>
        </div>
      ) : likedMovies.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl text-muted-foreground">
          <Film className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No liked titles in this genre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {likedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              liked
              onToggleLike={() => toggleLike(movie.id)}
              onOpen={() => setSelectedMovie(movie)}
              commentCount={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
