import { Routes, Route } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import WatchList from "../Pages/WatchList";
import PageNotFound from "../Pages/PageNotFound";

export default function MovieRoutes(props) {
  return (
    <Routes>
      {/* index matches on default/home URL: / */}
      <Route index element={<HomePage {...props} />} />
      {/* nested routes, matches on /dash/messages etc */}
      <Route path="watchlist" element={<WatchList {...props} />} />
      {/* catch all, matches on anything else */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
