import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ReviewContext = createContext(null);

export function useReviews() {
  return useContext(ReviewContext);
}

const normalizeReview = (r) => ({
  id: r._id,
  author: r.user?.username ?? "Anonymous",
  initials: (r.user?.username ?? "??").slice(0, 2).toUpperCase(),
  text: r.reviewDescription ?? "",
  title: r.title ?? "",
  rating: r.rating ?? null,
  date: new Date(r.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  likes: r.likeCount ?? 0,
  showId: r.showId,
  userId: r.user?._id ?? r.user,
});

export function ReviewProvider({ children }) {
  const [allReviews, setAllReviews] = useState([]);
  const [reviewsByShow, setReviewsByShow] = useState({});
  const [likedReviewIds, setLikedReviewIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("authToken");

  const fetchMyReviews = async () => {
    const token = getToken();
    if (!token) {
      setAllReviews([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get("/api/reviews/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllReviews(response.data.map(normalizeReview));
    } catch (err) {
      console.error("Failed to fetch my reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsForShow = async (showId) => {
    try {
      const response = await axios.get(`/api/reviews/show/${showId}`);
      const normalized = response.data.map(normalizeReview);
      setReviewsByShow((prev) => ({ ...prev, [showId]: normalized }));
      return normalized;
    } catch (err) {
      console.error("Failed to fetch reviews for show", showId, err);
      return [];
    }
  };

  const postReview = async (showId, { title, reviewDescription, rating }) => {
    const token = getToken();
    if (!token) {
      window.dispatchEvent(new CustomEvent("requireAuth"));
      return null;
    }
    try {
      const response = await axios.post(
        "/api/reviews",
        { showId: Number(showId), title, reviewDescription, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newReview = normalizeReview({ ...response.data, likeCount: 0 });

      setReviewsByShow((prev) => ({
        ...prev,
        [showId]: [newReview, ...(prev[showId] ?? [])],
      }));
      setAllReviews((prev) => [newReview, ...prev]);

      return newReview;
    } catch (err) {
      console.error("Failed to post review", err);
      return null;
    }
  };

  const toggleReviewLike = async (reviewId) => {
    const token = getToken();
    if (!token) {
      window.dispatchEvent(new CustomEvent("requireAuth"));
      return;
    }

    const alreadyLiked = likedReviewIds.has(reviewId);
    const delta = alreadyLiked ? -1 : 1;

    setLikedReviewIds((prev) => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(reviewId) : next.add(reviewId);
      return next;
    });

    const applyDelta = (reviews) =>
      reviews.map((r) =>
        r.id === reviewId ? { ...r, likes: r.likes + delta } : r
      );

    setAllReviews((prev) => applyDelta(prev));
    setReviewsByShow((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = applyDelta(next[key]);
      }
      return next;
    });

    try {
      if (alreadyLiked) {
        await axios.delete("/api/likes", {
          data: { review: reviewId },
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          "/api/likes",
          { review: reviewId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      setLikedReviewIds((prev) => {
        const next = new Set(prev);
        alreadyLiked ? next.add(reviewId) : next.delete(reviewId);
        return next;
      });
      const revert = (reviews) =>
        reviews.map((r) =>
          r.id === reviewId ? { ...r, likes: r.likes - delta } : r
        );
      setAllReviews((prev) => revert(prev));
      setReviewsByShow((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = revert(next[key]);
        }
        return next;
      });
      console.error("Failed to toggle review like", err);
    }
  };

  useEffect(() => {
    void fetchMyReviews();
    window.addEventListener("authStateChanged", fetchMyReviews);
    window.addEventListener("storage", fetchMyReviews);
    return () => {
      window.removeEventListener("authStateChanged", fetchMyReviews);
      window.removeEventListener("storage", fetchMyReviews);
    };
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        allReviews,
        reviewsByShow,
        likedReviewIds,
        totalReviewCount: allReviews.length,
        loading,
        fetchMyReviews,
        fetchReviewsForShow,
        postReview,
        toggleReviewLike,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}