import { AbstractView } from '../framework';
import { emotions, emotionIds } from '../data';

import {
  formatCommentDate,
  formatMovieDuration,
  formatMovieRating,
  formatMovieReleaseDate,
} from '../utils';

function createMoviePopupCommentTemplate(comment) {
  const { text, emotion, date, author: { name } } = comment;
  const formattedDate = formatCommentDate(date);

  return (
    `<li class="comment">
      <img
        class="comment__emotion"
        src="${emotions[emotion].iconUrl}"
        width="55"
        height="55"
        alt="${emotions[emotion].name} emoji."
        loading="lazy"
      >
      <blockquote class="comment__text">${text}</blockquote>
      <p class="comment__author">${name}</p>
      <time class="comment__date" datetime="${date}">${formattedDate}</time>
      <button class="comment__delete-button link" type="button">Delete</button>
    </li>`
  );
}

function createMoviePopupCommentListTemplate(comments) {
  if (!comments.length) {
    return '';
  }

  return (
    `<ul class="comments__list comment-list">
      ${comments.map(createMoviePopupCommentTemplate).join('')}
    </ul>`
  );
}

function createMoviePopupCommentFormTemplate() {
  return (
    `<form class="comment-form" action="https://echo.htmlacademy.ru/courses" method="post">
      <div class="comment-form__emotion-wrapper" aria-hidden="true"></div>
      <label class="comment-form__field text-area">
        <textarea class="text-area__control" name="text" rows="1" placeholder="Good movie!" required></textarea>
        <span class="text-area__label">Select reaction below and write comment here</span>
      </label>
      <fieldset class="comment-form__emotions">
        <legend class="visually-hidden">Emotion:</legend>
        ${emotionIds.map((id) => `
          <label class="checker checker--icon">
            <input class="checker__control visually-hidden" name="emotion" value="${id}" type="radio" required>
            <img
              class="checker__label"
              src="${emotions[id].iconUrl}"
              width="30"
              height="30"
              alt="${emotions[id].name} emoji."
            >
          </label>
        `).join('')}
      </fieldset>
    </form>`
  );
}

function createMoviePopupTemplate(movie, comments) {
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
    commentsCount,
  } = movie;

  const formattedRating = formatMovieRating(rating);
  const formattedReleaseDate = formatMovieReleaseDate(releaseDate);
  const formattedDuration = formatMovieDuration(duration);

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
          <section class="movie__comments comments">
            <h3 class="comments__title title title--size_m">Comments ${commentsCount}</h3>
            ${createMoviePopupCommentListTemplate(comments)}
            ${createMoviePopupCommentFormTemplate()}
          </section>
        </article>
      </div>
    </dialog>`
  );
}

export default class MoviePopupView extends AbstractView {
  #movie = null;
  #comments = [];
  #onWatchlistButtonClick = null;
  #onWatchedButtonClick = null;
  #onFavoriteButtonClick = null;
  #onCloseButtonClick = null;

  constructor({
    movie,
    comments,
    onWatchlistButtonClick,
    onWatchedButtonClick,
    onFavoriteButtonClick,
    onCloseButtonClick,
  }) {
    super();
    this.#movie = movie;
    this.#comments = comments;
    this.#onWatchlistButtonClick = onWatchlistButtonClick;
    this.#onWatchedButtonClick = onWatchedButtonClick;
    this.#onFavoriteButtonClick = onFavoriteButtonClick;
    this.#onCloseButtonClick = onCloseButtonClick;

    this.element.querySelector('.icon-button--icon_list-add')
      .addEventListener('click', this.#watchlistButtonClickHandler);

    this.element.querySelector('.icon-button--icon_checkmark')
      .addEventListener('click', this.#watchedButtonClickHandler);

    this.element.querySelector('.icon-button--icon_star')
      .addEventListener('click', this.#favoriteButtonClickHandler);

    this.element.querySelector('.popup__close-button')
      .addEventListener('click', this.#closeButtonClickHandler, { once: true });
  }

  _getTemplate() {
    return createMoviePopupTemplate(this.#movie, this.#comments);
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

  #watchlistButtonClickHandler = () => {
    this.#onWatchlistButtonClick();
  };

  #watchedButtonClickHandler = () => {
    this.#onWatchedButtonClick();
  };

  #favoriteButtonClickHandler = () => {
    this.#onFavoriteButtonClick();
  };

  #closeButtonClickHandler = () => {
    this.#onCloseButtonClick();
  };
}
