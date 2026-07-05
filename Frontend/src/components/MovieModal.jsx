import { useState, useEffect, useContext } from "react";
import {
  Heart, Plus, X, Star, MessageCircle,
  BookmarkPlus, ChevronDown, Check, User,
} from "lucide-react";
import { posterUrl, backdropUrl } from "../utils/helpers.js";
import { ReviewContext } from "../context/reviewContext.jsx";
import { ListContext } from "../context/listContext.jsx";

export default function MovieModal({
  movie, liked, onClose, onToggleLike,
  showAddToList, onToggleAddToList,
  onActorClick,
}) {
  const [newComment, setNewComment] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newRating, setNewRating] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    reviewsByShow,
    likedReviewIds,
    fetchReviewsForShow,
    postReview,
    toggleReviewLike,
  } = useContext(ReviewContext);

  const { lists, toggleMovieInList } = useContext(ListContext);

  const showId = movie?.id;
  const reviews = reviewsByShow[showId] ?? [];

  // Load reviews for this show whenever the modal opens
  useEffect(() => {
    if (showId) void fetchReviewsForShow(showId);
  }, [showId]);

  const handlePostReview = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    await postReview(showId, {
      title: newTitle.trim() || undefined,
      reviewDescription: newComment.trim(),
      rating: newRating ? Number(newRating) : undefined,
    });
    setNewComment("");
    setNewTitle("");
    setNewRating("");
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col">

        {/* Backdrop */}
        <div className="relative h-52 shrink-0 overflow-hidden">
          <img src={backdropUrl(movie.photo)} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-card/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex gap-6">
            {/* Poster */}
            <div className="shrink-0 -mt-24 relative z-10">
              <img
                src={posterUrl(movie.photo, 200, 300)}
                alt={movie.title}
                className="w-32 md:w-40 rounded-xl shadow-2xl border border-border"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2
                    className="text-3xl md:text-4xl font-black leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {movie.title.toUpperCase()}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap text-sm text-muted-foreground">
                    <span>{movie.year}</span>
                    <span>·</span>
                    <span>{movie.runtime}</span>
                    <span>·</span>
                    <span className="text-xs font-mono uppercase tracking-widest">
                      {movie.type === "tv" ? "TV Series" : "Film"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    {(movie.genres ?? []).map((g) => (
                      <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end text-primary">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-2xl font-bold">{movie.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Rating</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono mb-1">Director</p>
                  <p className="text-foreground font-medium">{movie.director}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono mb-2">Starring</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(movie.cast ?? []).map((name) => (
                      <button
                        key={name}
                        onClick={() => onActorClick(name)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-colors"
                      >
                        <User className="w-2.5 h-2.5" />
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {movie.description}
              </p>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <button
                  onClick={onToggleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    liked
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"}
                </button>

                <div className="relative">
                  <button
                    onClick={onToggleAddToList}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    Add to List
                    <ChevronDown className={`w-3 h-3 transition-transform ${showAddToList ? "rotate-180" : ""}`} />
                  </button>
                  {showAddToList && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-2xl z-20 overflow-hidden py-1">
                      {lists.map((list) => {
                        const inList = list.movieIds.includes(String(movie.id));
                        return (
                          <button
                            key={list.id}
                            onClick={() => toggleMovieInList(list.id, String(movie.id))}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted transition-colors text-foreground"
                          >
                            <span className="truncate">{list.name}</span>
                            {inList
                              ? <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                              : <Plus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            }
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="font-semibold text-base mb-5 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              Reviews
              <span className="text-muted-foreground font-normal text-sm">({reviews.length})</span>
            </h3>

            {/* Write a review */}
            <div className="flex gap-3 mb-7">
              <div className="flex-1 space-y-2">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Review title (optional)"
                  className="w-full bg-muted px-4 py-2 rounded-xl text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary/40 transition-colors"
                />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this title..."
                  rows={2}
                  className="w-full bg-muted px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary/40 resize-none transition-colors"
                />
                <div className="flex items-center justify-between">
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="bg-muted border border-border rounded-lg text-sm text-muted-foreground px-3 py-1.5 focus:outline-none focus:border-primary/40"
                  >
                    <option value="">Rating (optional)</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>{n}/10</option>
                    ))}
                  </select>
                  <button
                    onClick={handlePostReview}
                    disabled={!newComment.trim() || submitting}
                    className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? "Posting..." : "Post Review"}
                  </button>
                </div>
              </div>
            </div>

            {/* Review list */}
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No reviews yet — be the first to share your thoughts.
              </p>
            ) : (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-foreground">{review.author}</span>
                        {review.rating && (
                          <span className="flex items-center gap-0.5 text-xs text-primary">
                            <Star className="w-3 h-3 fill-current" />
                            {review.rating}/10
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
                      </div>
                      {review.title && (
                        <p className="text-sm font-medium text-foreground mb-1">{review.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                      <button
                        onClick={() => toggleReviewLike(review.id)}
                        className={`flex items-center gap-1 mt-2 text-xs transition-colors ${
                          likedReviewIds.has(review.id)
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${likedReviewIds.has(review.id) ? "fill-current" : ""}`} />
                        <span>{review.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
