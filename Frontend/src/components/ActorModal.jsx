import { X, ArrowLeft, User, Film, Tv, Star, Heart } from "lucide-react";
import { posterUrl } from "../utils/helpers.js";

export default function ActorModal({ actorName, movies, onClose, onMovieClick, likedIds, onToggleLike }) {
  const initials = actorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-card rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-border shrink-0">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-lg font-black text-primary" style={{ fontFamily: "var(--font-display)" }}>{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              {actorName.toUpperCase()}
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {movies.length} title{movies.length !== 1 ? "s" : ""} in this collection
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gallery */}
        <div className="overflow-y-auto flex-1 p-6">
          {movies.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No titles found for this actor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {movies.map((movie) => (
                <div key={movie.id} className="group cursor-pointer" onClick={() => onMovieClick(movie)}>
                  <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-muted">
                    <img src={posterUrl(movie.photo)} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-black/60 text-white/80 flex items-center gap-1">
                        {movie.type === "tv" ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                        {movie.type === "tv" ? "TV" : "Film"}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-md px-1.5 py-0.5">
                      <Star className="w-2.5 h-2.5 text-primary fill-current" />
                      <span className="text-[10px] font-mono text-white/90">{movie.rating}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleLike(movie.id); }}
                        className={`p-1.5 rounded-full backdrop-blur-sm border transition-colors ${
                          likedIds.has(movie.id)
                            ? "bg-primary/20 border-primary/40 text-primary"
                            : "bg-black/50 border-white/20 text-white hover:text-primary hover:border-primary/40"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedIds.has(movie.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 px-0.5">
                    <p className="font-semibold text-sm text-foreground leading-tight line-clamp-1">{movie.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{movie.year}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
