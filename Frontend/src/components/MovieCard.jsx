import { Heart, MessageCircle, Film, Tv, Star } from "lucide-react";
import { posterUrl } from "../utils/helpers.js";

export default function MovieCard({ movie, liked, onToggleLike, onOpen, commentCount }) {
  return (
    <div className="group relative cursor-pointer" onClick={onOpen}>
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-muted">
        <img
          src={posterUrl(movie.photo)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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

        <div className={`absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between transition-opacity duration-300 ${liked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
            className={`p-1.5 rounded-full backdrop-blur-sm border transition-colors ${
liked
  ? "bg-red-500/20 border-red-500/40 text-red-500"
  : "bg-black/50 border-white/20 text-white hover:text-red-500 hover:border-red-500/40"            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
          </button>
          {commentCount > 0 && (
            <div className="flex items-center gap-1 text-white/70">
              <MessageCircle className="w-3 h-3" />
              <span className="text-[10px]">{commentCount}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <p className="font-semibold text-sm text-foreground leading-tight line-clamp-1">{movie.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{movie.year}</p>
      </div>
    </div>
  );
}
