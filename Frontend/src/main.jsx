import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";
import { MovieProvider } from "./context/movieContext.jsx";
import { ListProvider } from "./context/listContext.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MovieProvider>
      <ListProvider>
        <App />
      </ListProvider>
    </MovieProvider>
  </React.StrictMode>,
);
