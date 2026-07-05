import { useContext } from "react";
import { MessageCircle, Heart, Star } from "lucide-react";
import { posterUrl } from "../utils/helpers.js";
import { ReviewContext } from "../context/reviewContext.jsx";
import { MovieContext } from "../context/movieContext.jsx";

export default function Reviews({ searchQuery, setSelectedMovie }) {
  const { allReviews, likedReviewIds, toggleReviewLike, loading } =
    useContext(ReviewContext);
  const { allMovies } = useContext(MovieContext);

  const token = localStorage.getItem("authToken");

  if (!token) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center text-muted-foreground">
        <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Log in to see your reviews.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center text-muted-foreground">
        <p className="text-sm">Loading reviews…</p>
      </div>
    );
  }

  const enriched = allReviews
    .map((review) => {
      const movie = allMovies.find(
        (m) => Number(m.id) === Number(review.showId)
      );
      return movie ? { ...review, movie } : null;
    })
    .filter(Boolean)
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.text.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.movie.title.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.likes - a.likes);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-5xl font-black leading-none mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          MY REVIEWS
        </h1>
        <p className="text-muted-foreground text-sm">
          {enriched.length} review{enriched.length !== 1 ? "s" : ""}
        </p>
      </div>

      {enriched.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl text-muted-foreground">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {searchQuery
              ? "No reviews match your search."
              : "You haven't reviewed anything yet. Open a title to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {enriched.map((review) => (
            <div
              key={review.id}
              className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4 hover:border-primary/20 transition-colors group"
            >
              <button
                onClick={() => setSelectedMovie(review.movie)}
                className="flex items-center gap-3 text-left"
              >
                <img
                  src={posterUrl(review.movie.photo, 80, 120)}
                  alt={review.movie.title}
                  className="w-10 h-14 object-cover rounded-lg shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {review.movie.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {review.movie.year} ·{" "}
                    {review.movie.type === "tv" ? "TV Series" : "Film"}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3 h-3 text-primary fill-current" />
                    <span className="text-xs text-primary font-medium">
                      {review.movie.rating}
                    </span>
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
                    <span className="text-sm font-semibold text-foreground">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {review.rating && (
                        <span className="flex items-center gap-0.5 text-xs text-primary">
                          <Star className="w-3 h-3 fill-current" />
                          {review.rating}/10
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </div>
                  {review.title && (
                    <p className="text-xs font-medium text-foreground mb-1">
                      {review.title}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.text}
                  </p>
                  <button
                    onClick={() => toggleReviewLike(review.id)}
                    className={`flex items-center gap-1 mt-3 text-xs transition-colors ${
                      likedReviewIds.has(review.id)
                        ? "text-red-500"
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-3 h-3 ${likedReviewIds.has(review.id) ? "fill-current" : ""}`}
                    />
                    <span>{review.likes} liked this</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}