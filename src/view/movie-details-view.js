import { AbstractView } from '../framework';

import {
  formatMovieDuration,
  formatMovieRating,
  formatMovieReleaseDate,
  getDeclension,
} from '../utils';

function createMovieDetailsTemplate(movie) {
  const {
    title,
    originalTitle,
    rating,
    posterUrl,
    ageRating,
    director,
    writers,
    actors,
    releaseDate,
    releaseCountry,
    duration,
    description,
    genres,
  } = movie;

  const formattedRating = formatMovieRating(rating);
  const formattedReleaseDate = formatMovieReleaseDate(releaseDate);
  const formattedDuration = formatMovieDuration(duration);
  const genresLabel = getDeclension(genres.length, { one: 'Genre', many: 'Genres' });

  return (
    `<article class="popup__movie movie">
      <h2 class="movie__title title title--size_xxl">${title}</h2>
      <p class="movie__subtitle">Original: ${originalTitle}</p>
      <p class="movie__rating">
        <span class="visually-hidden">Rating:</span> ${formattedRating}
      </p>
      <div class="movie__poster-wrapper">
        <img class="movie__poster" src="${posterUrl}" width="338" height="500" alt="Poster.">
        <p class="movie__age-rating">
          <span class="visually-hidden">Age rating:</span> ${ageRating}+
        </p>
      </div>
      <dl class="movie__details">
        <dt>Director</dt>
        <dd class="movie__details-value">${director}</dd>
        <dt>Writers</dt>
        <dd class="movie__details-value">${writers.join(', ')}</dd>
        <dt>Actors</dt>
        <dd class="movie__details-value">${actors.join(', ')}</dd>
        <dt>Release Date</dt>
        <dd class="movie__details-value">
          <time datetime="${releaseDate}">${formattedReleaseDate}</time>
        </dd>
        <dt>Duration</dt>
        <dd class="movie__details-value">${formattedDuration}</dd>
        <dt>Country</dt>
        <dd class="movie__details-value">${releaseCountry}</dd>
        <dt>${genresLabel}</dt>
        <dd class="movie__details-value movie__details-value--list">
          ${genres.map((genre) => `<span>${genre}</span>`).join('')}
        </dd>
      </dl>
      <p class="movie__description">${description}</p>
    </article>`
  );
}

export default class MovieDetailsView extends AbstractView {
  #movie = null;

  constructor({ movie }) {
    super();
    this.#movie = movie;
  }

  _getTemplate() {
    return createMovieDetailsTemplate(this.#movie);
  }
}
