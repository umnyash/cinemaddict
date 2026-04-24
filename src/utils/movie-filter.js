import { MovieStatus } from '../constants.js';

const statusToFlagMap = {
  [MovieStatus.WATCHLISTED]: 'isWatchlisted',
  [MovieStatus.WATCHED]: 'isWatched',
  [MovieStatus.FAVORITED]: 'isFavorited',
};

function checkMovieStatus(movie, status) {
  const flag = statusToFlagMap[status];

  if (!flag) {
    throw new Error(`Unsupported movie status: ${status}`);
  }

  return movie[flag];
}

function calcMovieCountsByStatus(movies) {
  const statuses = Object.values(MovieStatus);

  return movies.reduce((result, movie) => {
    statuses.forEach((status) => {
      result[status] += Number(checkMovieStatus(movie, status));
    });

    return result;
  }, {
    [MovieStatus.WATCHLISTED]: 0,
    [MovieStatus.WATCHED]: 0,
    [MovieStatus.FAVORITED]: 0,
  });
}

function filterMovies(movies, filter) {
  const { status } = filter;

  return status
    ? movies.filter((movie) => checkMovieStatus(movie, status))
    : [...movies];
}

export { filterMovies, calcMovieCountsByStatus };
