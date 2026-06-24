import MovieCard from "./MovieCard";

export default function Movies({
  movies,
  watchList,
  onMoreDetails,
  putInWatchList,
}) {
  return (
    <div className="d-flex flex-wrap justify-content-center">
      {/*xTODO: remove html tags from movie description*/}
      {movies.map((movie, index) => {
        const isInWatchList = watchList.some(
          (watchItem) => watchItem.id === movie.id,
        );
        return (
          <MovieCard
            key={movie.id ?? movie._id ?? movie.key ?? index}
            title={movie.title}
            description={movie.description}
            imageUrl={movie.imageUrl}
            onMoreDetails={() => {
              onMoreDetails(movie.id);
            }}
            putInWatchList={() => putInWatchList(movie)}
            isInWatchList={isInWatchList}
          />
        );
      })}
    </div>
  );
}
