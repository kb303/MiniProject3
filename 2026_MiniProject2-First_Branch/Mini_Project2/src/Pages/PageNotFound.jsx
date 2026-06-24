import NavBar from "../Components/NavBar";
import { useContext } from "react";
import { MovieContext } from "../Contexts/MovieContext";

export default function PageNotFound() {
  return (
    <>
      <NavBar />
      <div className="PageNotFound">
        <h1>Page Not Found</h1>
      </div>
    </>
  );
}
