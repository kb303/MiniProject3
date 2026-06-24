//retrieve movie data from api
const data = fetch("https://api.tvmaze.com/shows").then((response) =>
  response.json().then((json) => {
    return json;
  }),
);

const watchList = new Set();

const getWatchList = () => {
  return Array.from(watchList).map((item) =>
    typeof item === "string" ? JSON.parse(item) : item,
  );
};

// Normalize different API response shapes into a plain array of show objects
function normalizeShows(raw) {
  if (!raw) return [];
  if (!Array.isArray(raw)) return [];
  // If search endpoint was used, items look like { score, show }
  if (raw.length > 0 && raw[0].show) {
    return raw.map((item) => item.show || null).filter(Boolean);
  }
  return raw;
}

const addToWatchList = async (movieId) => {
  const raw = await data;
  const shows = normalizeShows(raw);
  const movie = shows.find((show) => show.id === movieId);
  if (movie) {
    const movieObj = {
      id: movie.id,
      title: movie.name,
      description: movie.summary,
      imageUrl: movie.image?.medium || "",
      genres: movie.genres || [],
    };
    watchList.add(JSON.stringify(movieObj));
    return movieObj;
  }
  return null;
};

const removeFromWatchList = async (movieId) => {
  const itemToRemove = Array.from(watchList).find((item) => {
    const parsed = typeof item === "string" ? JSON.parse(item) : item;
    return parsed.id === movieId;
  });

  if (itemToRemove) {
    watchList.delete(itemToRemove);
    const parsed =
      typeof itemToRemove === "string"
        ? JSON.parse(itemToRemove)
        : itemToRemove;
    return parsed;
  }

  return null;
};

let currentSearch = "";

const displayAllShows = async () => {
  const raw = await data;
  const shows = normalizeShows(raw);
  return shows
    .map((show) => {
      const year = dateFormat(show.premiered);
      if (year === null) return null;
      return {
        id: show.id,
        title: show.name,
        description: show.summary,
        imageUrl: show.image?.medium || "",
      };
    })
    .filter(Boolean);
};

const getGenres = async () => {
  const raw = await data;
  const shows = normalizeShows(raw);
  const genres = new Set();
  shows.forEach((show) => {
    if (show && show.genres) {
      show.genres.forEach((genre) => genres.add(genre));
    }
  });
  return Array.from(genres);
};

const filteredShows = async (genre, searchTerm = "") => {
  const raw = await data;
  const shows = normalizeShows(raw);
  return shows
    .filter((show) => {
      const showGenres = show.genres || [];
      const genreMatch =
        !genre ||
        genre === "All" ||
        genre === "Themes" ||
        showGenres.includes(genre);
      const searchMatch =
        !searchTerm ||
        (show.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      return genreMatch && searchMatch;
    })
    .map((show) => {
      const year = dateFormat(show.premiered);
      if (year === null) return null;
      return {
        id: show.id,
        title: show.name,
        description: show.summary,
        imageUrl: show.image?.medium || "",
      };
    })
    .filter(Boolean);
};

function dateFormat(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const year = date.getFullYear();
  return isNaN(year) ? null : year;
}

module.exports = {
  filteredShows,
  displayAllShows,
  getGenres,
  getWatchList,
  addToWatchList,
  removeFromWatchList,
};
