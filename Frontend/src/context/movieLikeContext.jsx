import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const MovieLikeContext = createContext(null);

export function useMovieLikes() {
  return useContext(MovieLikeContext);
}

export function MovieLikeProvider({ children }) {
  const [likedIds, setLikedIds] = useState(new Set());

  const getToken = () => localStorage.getItem("authToken");

  const loadLikedMovies = async () => {
    const token = getToken();
    if (!token) {
      setLikedIds(new Set());
      return;
    }
    try {
      const response = await axios.get("/api/movie-likes/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Store as numbers to match TVMaze IDs
      setLikedIds(new Set(response.data.map((id) => Number(id))));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        window.dispatchEvent(new Event("authStateChanged"));
      }
      setLikedIds(new Set());
    }
  };

  useEffect(() => {
    void loadLikedMovies();

    const handleAuthChange = () => void loadLikedMovies();
    window.addEventListener("authStateChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const toggleMovieLike = async (showId) => {
    const token = getToken();
    const numericId = Number(showId);

    if (!token) {
      // Signal to the UI that auth is required
      window.dispatchEvent(new CustomEvent("requireAuth"));
      return;
    }

    const alreadyLiked = likedIds.has(numericId);

    // Optimistic update
    setLikedIds((prev) => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(numericId) : next.add(numericId);
      return next;
    });

    try {
      if (alreadyLiked) {
        await axios.delete("/api/movie-likes", {
          data: { showId: numericId },
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          "/api/movie-likes",
          { showId: numericId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      // Revert on failure
      setLikedIds((prev) => {
        const next = new Set(prev);
        alreadyLiked ? next.add(numericId) : next.delete(numericId);
        return next;
      });
      console.error("Failed to toggle movie like", err);
    }
  };

  return (
    <MovieLikeContext.Provider value={{ likedIds, toggleMovieLike }}>
      {children}
    </MovieLikeContext.Provider>
  );
}
