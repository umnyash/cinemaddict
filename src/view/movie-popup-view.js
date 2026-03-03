import { AbstractView } from '../framework';
import { formatDate, formatDuration, formatRating } from '../utils.js';

function createMoviePopupTemplate(movie) {
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
    isOnWatchlist,
    isWatched,
    isFavorite,
  } = movie;

  const formattedRating = formatRating(rating);
  const formattedReleaseDate = formatDate(releaseDate);
  const formattedDuration = formatDuration(duration);

  return (
    `<dialog class="popup popup--position_right">
      <div class="popup__inner">
        <button class="popup__close-button">
          <span class="visually-hidden">Close</span>
        </button>
        <article class="popup__movie movie">
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
            <dt>Genres</dt>
            <dd class="movie__details-value movie__details-value--list">
              ${genres.map((genre) => `<span>${genre}</span>`).join('')}
            </dd>
          </dl>
          <p class="movie__description">${description}</p>
          <div class="movie__actions">
            <button class="icon-button icon-button--icon_list-add" aria-pressed="${isOnWatchlist}">
              <span class="icon-button__text">Add to watchlist</span>
            </button>
            <button class="icon-button icon-button--icon_checkmark" aria-pressed="${isWatched}">
              <span class="icon-button__text">Already watched</span>
            </button>
            <button class="icon-button icon-button--icon_star" aria-pressed="${isFavorite}">
              <span class="icon-button__text">Add to favorites</span>
            </button>
          </div>
        </article>
      </div>
    </dialog>`
  );
}

export default class MoviePopupView extends AbstractView {
  #movie = null;
  #onCloseButtonClick = null;

  constructor({ movie, onCloseButtonClick }) {
    super();
    this.#movie = movie;
    this.#onCloseButtonClick = onCloseButtonClick;
    this.element.querySelector('.popup__close-button')
      .addEventListener('click', this.#closeButtonClickHandler, { once: true });
  }

  _getTemplate() {
    return createMoviePopupTemplate(this.#movie);
  }

  open() {
    this.element.show();
  }

  close() {
    return new Promise((resolve) => {
      const popupTransitionEndHandler = (evt) => {
        if (evt.target === this.element && evt.propertyName === 'visibility') {
          this.element.removeEventListener('transitionend', popupTransitionEndHandler);
          resolve();
        }
      };

      this.element.addEventListener('transitionend', popupTransitionEndHandler);
      this.element.close();
    });
  }

  #closeButtonClickHandler = () => {
    this.#onCloseButtonClick();
  };
}
