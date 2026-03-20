import { AbstractView } from '../framework';
import { formatMovieDuration, formatMovieRating, formatMovieReleaseYear } from '../utils';

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

  const releaseYear = formatMovieReleaseYear(releaseDate);
  const formattedDescription = formatDescription(description);
  const formattedDuration = formatMovieDuration(duration);
  const formattedRating = formatMovieRating(rating);
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

export default class MovieCardView extends AbstractView {
  #onLinkClick = null;
  #onWatchlistButtonClick = null;
  #onWatchedButtonClick = null;
  #onFavoriteButtonClick = null;

  constructor({
    movie,
    onLinkClick,
    onWatchlistButtonClick,
    onWatchedButtonClick,
    onFavoriteButtonClick,
  }) {
    super();
    this.movie = movie;
    this.#onLinkClick = onLinkClick;
    this.#onWatchlistButtonClick = onWatchlistButtonClick;
    this.#onWatchedButtonClick = onWatchedButtonClick;
    this.#onFavoriteButtonClick = onFavoriteButtonClick;

    this.element.querySelector('.movie-card__link')
      .addEventListener('click', this.#linkClickHandler);

    this.element.querySelector('.icon-button--icon_list-add')
      .addEventListener('click', this.#watchlistButtonClickHandler);

    this.element.querySelector('.icon-button--icon_checkmark')
      .addEventListener('click', this.#watchedButtonClickHandler);

    this.element.querySelector('.icon-button--icon_star')
      .addEventListener('click', this.#favoriteButtonClickHandler);
  }

  _getTemplate() {
    return createMovieCardTemplate(this.movie);
  }

  #linkClickHandler = (evt) => {
    evt.preventDefault();
    this.#onLinkClick();
  };

  #watchlistButtonClickHandler = () => {
    this.#onWatchlistButtonClick();
  };

  #watchedButtonClickHandler = () => {
    this.#onWatchedButtonClick();
  };

  #favoriteButtonClickHandler = () => {
    this.#onFavoriteButtonClick();
  };
}
