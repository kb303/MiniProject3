import { useEffect, useState, useContext } from "react";
import { Film, Search, User } from "lucide-react";
import AuthPanel from "./AuthPanel.jsx";
import { ReviewContext } from "../context/reviewContext.jsx";

const NAV_ITEMS = ["discover", "lists", "liked", "reviews"];

export default function Navbar({
  view,
  setView,
  likedIds,
  actorSearch,
  setActorSearch,
  searchQuery,
  setSearchQuery,
}) {
  const { totalReviewCount } = useContext(ReviewContext);

  const getLabel = (v) => {
    if (v === "liked") return `Liked (${likedIds.size})`;
    if (v === "lists") return "My Lists";
    if (v === "reviews") return `Reviews (${totalReviewCount})`;
    return "Discover";
  };

  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const syncUserFromStorage = () => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    syncUserFromStorage();
    window.addEventListener("authStateChanged", syncUserFromStorage);
    window.addEventListener("storage", syncUserFromStorage);
    return () => {
      window.removeEventListener("authStateChanged", syncUserFromStorage);
      window.removeEventListener("storage", syncUserFromStorage);
    };
  }, []);

  const searchPlaceholder =
    view === "reviews" ? "Search reviews..." : "Search titles...";

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (view !== "discover" && view !== "reviews") setView("discover");
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
            <Film className="w-4 h-4 text-primary-foreground" />
          </div>
          <span
            className="text-xl font-black tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CINELOG
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                view === v
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {getLabel(v)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 bg-muted text-sm rounded-md text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Auth */}
        <div className="relative">
          <button
            onClick={() => setShowAuth((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            aria-label="Open account menu"
          >
            {currentUser?.firstName ? (
              <span className="text-sm font-semibold uppercase">
                {currentUser.firstName.charAt(0)}
              </span>
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>
          {showAuth && <AuthPanel onClose={() => setShowAuth(false)} />}
        </div>
      </div>
    </nav>
  );
}
