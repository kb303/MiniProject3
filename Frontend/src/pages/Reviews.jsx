import { MessageCircle, Heart, Star } from "lucide-react";
import { MOVIES } from "../data/index.js";
import { posterUrl } from "../utils/helpers.js";

export default function Reviews({ comments, searchQuery, setSelectedMovie }) {
  const allReviews = Object.entries(comments)
    .flatMap(([movieId, movieComments]) => {
      const movie = MOVIES.find((m) => m.id === movieId);
      return movieComments.map((c) => ({ ...c, movie }));
    })
    .filter((r) => r.movie)
    .filter((r) =>
      !searchQuery ||
      r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.likes - a.likes);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-5xl font-black leading-none mb-2" style={{ fontFamily: "var(--font-display)" }}>ALL REVIEWS</h1>
        <p className="text-muted-foreground text-sm">
          {allReviews.length} review{allReviews.length !== 1 ? "s" : ""} across the collection
        </p>
      </div>

      {allReviews.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl text-muted-foreground">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No reviews match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allReviews.map((review) => (
            <div key={review.id} className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4 hover:border-primary/20 transition-colors group">
              <button onClick={() => setSelectedMovie(review.movie)} className="flex items-center gap-3 text-left">
                <img src={posterUrl(review.movie.photo, 80, 120)} alt={review.movie.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">{review.movie.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{review.movie.year} · {review.movie.type === "tv" ? "TV Series" : "Film"}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3 h-3 text-primary fill-current" />
                    <span className="text-xs text-primary font-medium">{review.movie.rating}</span>
                  </div>
                </div>
              </button>

              <div className="border-t border-border" />

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                  {review.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-foreground">{review.author}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                  {review.likes > 0 && (
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                      <Heart className="w-3 h-3" />
                      <span>{review.likes} liked this</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
