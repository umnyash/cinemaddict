import { SortType } from '../constants.js';
import { formatDate, getYear } from './date.js';

const MINUTES_PER_HOUR = 60;
const RELEASE_DATE_FORMAT = 'D MMMM YYYY';

function formatMovieDuration(minutes) {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);

  if (hours === 0) {
    return `${minutes}m`;
  }

  const remainingMinutes = minutes % MINUTES_PER_HOUR;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatMovieRating(rating) {
  return rating.toFixed(1);
}

function formatMovieReleaseDate(date) {
  return formatDate(date, RELEASE_DATE_FORMAT);
}

function formatMovieReleaseYear(date) {
  return getYear(date);
}

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

export {
  formatMovieDuration,
  formatMovieRating,
  formatMovieReleaseDate,
  formatMovieReleaseYear,
  sortMoviesBy,
};
