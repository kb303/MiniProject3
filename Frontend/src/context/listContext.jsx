import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ListContext = createContext(null);

export function useListContext() {
  return useContext(ListContext);
}

export function ListProvider({ children }) {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState("");
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [listSorts, setListSorts] = useState({});
  const [isListReady, setIsListReady] = useState(false);

  const clearAuthState = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.dispatchEvent(new Event("authStateChanged"));
  };

  const handleAuthFailure = (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      clearAuthState();
      setLists([]);
      setActiveListId("");
      return true;
    }
    return false;
  };

  const loadSavedLists = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsListReady(true);
      return;
    }

    try {
      const response = await axios.get("/api/movies/lists", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        const normalized = response.data.map((list) => ({
          id: list._id ?? list.id,
          name: list.name,
          movieIds: Array.isArray(list.movieIds) ? list.movieIds : [],
        }));
        setLists(normalized);
        setActiveListId(normalized[0]?.id ?? "");
      } else {
        setLists([]);
        setActiveListId("");
      }
    } catch (error) {
      if (!handleAuthFailure(error)) {
        console.error("Failed to load saved lists", error);
      }
    } finally {
      setIsListReady(true);
    }
  };

  useEffect(() => {
    const syncLists = () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLists([]);
        setActiveListId("");
        setIsListReady(true);
        return;
      }

      void loadSavedLists();
    };

    syncLists();
    window.addEventListener("authStateChanged", syncLists);
    window.addEventListener("storage", syncLists);

    return () => {
      window.removeEventListener("authStateChanged", syncLists);
      window.removeEventListener("storage", syncLists);
    };
  }, []);

  const persistLists = async (
    nextLists,
    currentActiveListId = activeListId,
  ) => {
    const token = localStorage.getItem("authToken");
    if (!token || !isListReady || !currentActiveListId) return;

    try {
      await axios.put(
        `/api/movies/lists/${currentActiveListId}`,
        {
          name:
            nextLists.find((list) => list.id === currentActiveListId)?.name ??
            "Watchlist",
          movieIds:
            nextLists.find((list) => list.id === currentActiveListId)
              ?.movieIds ?? [],
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      if (!handleAuthFailure(error)) {
        console.error("Failed to save list updates", error);
      }
    }
  };

  const toggleMovieInList = async (listId, movieId) => {
    const nextLists = lists.map((list) => {
      if (list.id !== listId) return list;
      const has = list.movieIds.includes(movieId);
      return {
        ...list,
        movieIds: has
          ? list.movieIds.filter((id) => id !== movieId)
          : [...list.movieIds, movieId],
      };
    });

    setLists(nextLists);
    await persistLists(nextLists, listId);
  };

  const createList = async () => {
    if (!newListName.trim()) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.post(
        "/api/movies/lists",
        { name: newListName.trim(), movieIds: [] },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const createdList = {
        id: response.data._id ?? response.data.id,
        name: response.data.name ?? newListName.trim(),
        movieIds: Array.isArray(response.data.movieIds)
          ? response.data.movieIds
          : [],
      };

      setLists((prev) => [...prev, createdList]);
      setNewListName("");
      setShowNewList(false);
      setActiveListId(createdList.id);
    } catch (error) {
      if (!handleAuthFailure(error)) {
        console.error("Failed to create list", error);
      }
    }
  };

  const deleteList = async (listId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await axios.delete(`/api/movies/lists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (!handleAuthFailure(error)) {
        console.error("Failed to delete list", error);
      }
    }

    const remaining = lists.filter((list) => list.id !== listId);
    setLists(remaining);
    if (activeListId === listId) {
      setActiveListId(remaining[0]?.id ?? "");
    }
  };

  return (
    <ListContext.Provider
      value={{
        lists,
        setLists,
        activeListId,
        setActiveListId,
        showNewList,
        setShowNewList,
        newListName,
        setNewListName,
        listSorts,
        setListSorts,
        toggleMovieInList,
        createList,
        deleteList,
        isListReady,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}
