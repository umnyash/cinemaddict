import { createElement } from '../framework';
import { formatRating, formatYear, formatDuration } from '../utils.js';

const DESCRIPTION_MAX_LENGTH = 140;

function formatDescription(description) {
  return description.length > DESCRIPTION_MAX_LENGTH
    ? `${description.slice(0, DESCRIPTION_MAX_LENGTH - 1)}…`
    : description;
}

function getCommentsLabel(count) {
  return `comment${count === 1 ? '' : 's'}`;
}

function createMovieCardCommentsTemplate(commentsCount) {
  const text = commentsCount
    ? `${commentsCount} ${getCommentsLabel(commentsCount)}`
    : 'No comments';

  return `<p class="movie-card__comments-count">${text}</p>`;
}

function createMovieCardTemplate(movie) {
  const {
    title,
    posterUrl,
    releaseDate,
    description,
    genres,
    duration,
    rating,
    commentsCount,
    isOnWatchlist,
    isWatched,
    isFavorite,
  } = movie;

  const releaseYear = formatYear(releaseDate);
  const formattedDescription = formatDescription(description);
  const formattedDuration = formatDuration(duration);
  const formattedRating = formatRating(rating);
  const genre = genres[0];

  return (
    `<li class="movies-list__item">
      <article class="movie-card">
        <div>
          <h3 class="movie-card__title">
            <a class="movie-card__link" href="#">${title}</a>
          </h3>
          <p class="movie-card__rating">
            <span class="visually-hidden">Rating:</span> ${formattedRating}
          </p>
        </div>
        <img class="movie-card__poster" src="${posterUrl}" width="232" height="342" alt="Poster." loading="lazy">
        <dl class="movie-card__details">
          <dt class="visually-hidden">Release year:</dt>
          <dd class="movie-card__details-value">
            <time>${releaseYear}</time>
          </dd>
          <dt class="visually-hidden">Duration:</dt>
          <dd class="movie-card__details-value">${formattedDuration}</dd>
          <dt class="visually-hidden">Genre:</dt>
          <dd class="movie-card__details-value">${genre}</dd>
        </dl>
        <p class="movie-card__description">${formattedDescription}</p>
        ${createMovieCardCommentsTemplate(commentsCount)}
        <div class="movie-card__actions">
          <button class="icon-button icon-button--icon_list-add icon-button--compact" aria-pressed="${isOnWatchlist}">
            <span class="icon-button__text">Add to watchlist</span>
          </button>
          <button class="icon-button icon-button--icon_checkmark icon-button--compact" aria-pressed="${isWatched}">
            <span class="icon-button__text">Already watched</span>
          </button>
          <button class="icon-button icon-button--icon_star icon-button--compact" aria-pressed="${isFavorite}">
            <span class="icon-button__text">Add to favorites</span>
          </button>
        </div>
      </article>
    </li>`
  );
}

export default class MovieCardView {
  constructor({ movie }) {
    this.movie = movie;
  }

  getTemplate() {
    return createMovieCardTemplate(this.movie);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
