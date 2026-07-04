import { MOVIES } from "../data/index.js";

export const posterUrl = (value, w = 400, h = 600) => {
  if (!value) return "https://placehold.co/400x600?text=No+Poster";
  if (typeof value === "string" && /^(https?:)?\/\//i.test(value)) return value;
  return `https://images.unsplash.com/photo-${value}?w=${w}&h=${h}&fit=crop&auto=format`;
};

export const backdropUrl = (value) => {
  if (!value) return "https://placehold.co/1600x700?text=No+Backdrop";
  if (typeof value === "string" && /^(https?:)?\/\//i.test(value)) return value;
  return `https://images.unsplash.com/photo-${value}?w=1600&h=700&fit=crop&auto=format`;
};

export const sortMovies = (arr, key) => {
  const copy = [...arr];
  if (key === "year-asc") return copy.sort((a, b) => a.year - b.year);
  if (key === "year-desc") return copy.sort((a, b) => b.year - a.year);
  if (key === "rating-desc") return copy.sort((a, b) => b.rating - a.rating);
  if (key === "rating-asc") return copy.sort((a, b) => a.rating - b.rating);
  if (key === "title-asc")
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy;
};

export const getActorMovies = (actorName) =>
  MOVIES.filter((m) => m.cast.includes(actorName));
