import { User } from "lucide-react";
import { MOVIES } from "../data/index.js";
import { posterUrl } from "../utils/helpers.js";

export default function Actors({ actorSearch, setSelectedActor }) {
  const allActors = Array.from(
    new Map(MOVIES.flatMap((m) => m.cast.map((name) => [name, name]))).values()
  ).sort();

  const filtered = allActors.filter((name) =>
    name.toLowerCase().includes(actorSearch.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-5xl font-black leading-none mb-2" style={{ fontFamily: "var(--font-display)" }}>ACTORS</h1>
        <p className="text-muted-foreground text-sm">
          {filtered.length} actor{filtered.length !== 1 ? "s" : ""} — click to see their filmography
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl text-muted-foreground">
          <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No actors match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((name) => {
            const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            const titles = MOVIES.filter((m) => m.cast.includes(name));
            return (
              <button
                key={name}
                onClick={() => setSelectedActor(name)}
                className="group flex flex-col items-center gap-3 p-5 bg-card rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-center"
              >
                <div className="relative w-20 h-20">
                  {titles.slice(0, 3).map((m, i) => (
                    <div
                      key={m.id}
                      className="absolute inset-0 rounded-full overflow-hidden border-2 border-card"
                      style={{ transform: `rotate(${(i - 1) * 6}deg) scale(${1 - i * 0.04})`, zIndex: 3 - i, opacity: i === 0 ? 1 : 0 }}
                    >
                      <img src={posterUrl(m.photo, 120, 120)} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="absolute inset-0 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="text-xl font-black text-primary" style={{ fontFamily: "var(--font-display)" }}>{initials}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground leading-tight">{name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{titles.length} title{titles.length !== 1 ? "s" : ""}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
