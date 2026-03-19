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

export {
  formatMovieDuration,
  formatMovieRating,
  formatMovieReleaseDate,
  formatMovieReleaseYear,
};
