import { SortType } from '../constants.js';

const movieComparators = {
  [SortType.DATE_DESC]: (movieA, movieB) => new Date(movieB.releaseDate) - new Date(movieA.releaseDate),
  [SortType.RATING_DESC]: (movieA, movieB) => movieB.rating - movieA.rating,
};

function sortMoviesBy(movies, sortType) {
  const comparator = movieComparators[sortType];

  if (!comparator) {
    throw new Error(`Unsupported sort type: ${sortType}`);
  }

  return movies.sort(comparator);
}

export { sortMoviesBy };
