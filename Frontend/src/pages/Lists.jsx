import { Plus, Trash2, X, Star, List as ListIcon } from "lucide-react";
import SortSelect from "../components/SortSelect.jsx";
import { MOVIES } from "../data/index.js";
import { posterUrl, sortMovies } from "../utils/helpers.js";

export default function Lists({
  lists, activeListId, setActiveListId,
  showNewList, setShowNewList, newListName, setNewListName,
  createList, deleteList, listSorts, setListSorts,
  toggleMovieInList, setSelectedMovie,
}) {
  const activeList = lists.find((l) => l.id === activeListId);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 flex gap-8 min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black" style={{ fontFamily: "var(--font-display)" }}>MY LISTS</h2>
          <button
            onClick={() => setShowNewList((p) => !p)}
            className="w-7 h-7 flex items-center justify-center rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showNewList && (
          <div className="mb-4 p-3 bg-card rounded-xl border border-border">
            <input
              type="text"
              placeholder="List name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createList()}
              className="w-full text-sm bg-muted px-3 py-2 rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={createList} className="flex-1 text-xs py-1.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">Create</button>
              <button onClick={() => { setShowNewList(false); setNewListName(""); }} className="flex-1 text-xs py-1.5 bg-muted text-muted-foreground rounded-lg hover:text-foreground transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                activeListId === list.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="font-medium truncate">{list.name}</span>
              <span className="text-xs shrink-0 ml-2 opacity-60">{list.movieIds.length}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {activeList ? (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>
                  {activeList.name.toUpperCase()}
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  {activeList.movieIds.length} title{activeList.movieIds.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {activeList.movieIds.length > 1 && (
                  <SortSelect
                    value={listSorts[activeList.id] ?? "default"}
                    onChange={(v) => setListSorts((prev) => ({ ...prev, [activeList.id]: v }))}
                  />
                )}
                <button onClick={() => deleteList(activeList.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />Delete list
                </button>
              </div>
            </div>

            {activeList.movieIds.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-border rounded-2xl text-muted-foreground">
                <ListIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No titles in this list yet.</p>
                <p className="text-xs mt-1 opacity-60">Open any movie and use "Add to List" to add it here.</p>
              </div>
            ) : (() => {
              const listMovies = sortMovies(
                activeList.movieIds.map((id) => MOVIES.find((m) => m.id === id)).filter(Boolean),
                listSorts[activeList.id] ?? "default"
              );
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {listMovies.map((movie) => (
                    <div key={movie.id} className="group relative cursor-pointer" onClick={() => setSelectedMovie(movie)}>
                      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-muted">
                        <img src={posterUrl(movie.photo)} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-md px-1.5 py-0.5">
                          <Star className="w-2.5 h-2.5 text-primary fill-current" />
                          <span className="text-[10px] font-mono text-white/90">{movie.rating}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleMovieInList(activeList.id, movie.id); }}
                          className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white/70 hover:bg-destructive/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/70">{movie.type === "tv" ? "TV Series" : "Film"}</span>
                        </div>
                      </div>
                      <div className="mt-2 px-0.5">
                        <p className="font-semibold text-sm text-foreground leading-tight line-clamp-1">{movie.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{movie.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </>
        ) : (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-sm">Select or create a list to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
