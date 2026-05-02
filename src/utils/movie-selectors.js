import { getUniqueRandomArrayItems } from './common.js';

function getTopMovies(movies, getMetricValue, limit) {
  const moviesByMetricValue = movies.reduce((groupedMovies, movie) => {
    const metricValue = getMetricValue(movie);

    if (!metricValue) {
      return groupedMovies;
    }

    if (!groupedMovies.has(metricValue)) {
      groupedMovies.set(metricValue, []);
    }

    groupedMovies.get(metricValue).push(movie);

    return groupedMovies;
  }, new Map());

  const sortedMetricValues = Array
    .from(moviesByMetricValue.keys())
    .sort((a, b) => b - a);

  const topMovies = [];

  for (const value of sortedMetricValues) {
    const remainingSlotsCount = limit - topMovies.length;

    if (!remainingSlotsCount) {
      break;
    }

    const moviesOfMetricValue = moviesByMetricValue.get(value);

    const moviesToAdd = moviesOfMetricValue.length > remainingSlotsCount
      ? getUniqueRandomArrayItems(moviesOfMetricValue, remainingSlotsCount)
      : moviesOfMetricValue;

    topMovies.push(...moviesToAdd);
  }

  return topMovies;
}

export { getTopMovies };
