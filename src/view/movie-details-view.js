import { AbstractStatefulView } from '../framework';
import { emotions, emotionIds } from '../data';

import {
  formatCommentDate,
  formatMovieDuration,
  formatMovieRating,
  formatMovieReleaseDate,
  getDeclension,
  isEnterEvent,
} from '../utils';

const CommentFormFieldName = {
  EMOTION: 'emotion',
  TEXT: 'text',
};

function createMovieDetailsCommentTemplate(comment) {
  const { text, emotionId, date, author: { name } } = comment;
  const formattedDate = formatCommentDate(date);

  return (
    `<li class="comment">
      <img
        class="comment__emotion"
        src="${emotions[emotionId].iconUrl}"
        width="55"
        height="55"
        alt="${emotions[emotionId].name} emoji."
        loading="lazy"
      >
      <blockquote class="comment__text">${text}</blockquote>
      <p class="comment__author">${name}</p>
      <time class="comment__date" datetime="${date}">${formattedDate}</time>
      <button class="comment__delete-button link" type="button">Delete</button>
    </li>`
  );
}

function createMovieDetailsCommentListTemplate(comments) {
  if (!comments.length) {
    return '';
  }

  return (
    `<ul class="comments__list comment-list">
      ${comments.map(createMovieDetailsCommentTemplate).join('')}
    </ul>`
  );
}

function createMovieDetailsCommentFormTemplate(currentEmotionId, text) {
  return (
    `<form class="comment-form" action="https://echo.htmlacademy.ru/courses" method="post">
      <div class="comment-form__emotion-wrapper" aria-hidden="true">
        ${currentEmotionId ? `<img class="comment-form__emotion" src="${emotions[currentEmotionId].iconUrl}" width="55" height="55" alt="">` : ''}
      </div>
      <label class="comment-form__field text-area">
        <textarea class="text-area__control" name="${CommentFormFieldName.TEXT}" rows="1" placeholder="Good movie!" required>${text}</textarea>
        <span class="text-area__label">Select reaction below and write comment here</span>
      </label>
      <fieldset class="comment-form__emotions">
        <legend class="visually-hidden">Emotion:</legend>
        ${emotionIds.map((id) => `
          <label class="checker checker--icon">
            <input
              class="checker__control visually-hidden"
              name="${CommentFormFieldName.EMOTION}"
              value="${id}"
              type="radio"
              required
              ${id === currentEmotionId ? 'checked' : ''}
            >
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

function createMovieDetailsTemplate({ movie, comments, state }) {
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
    commentsCount,
  } = movie;

  const {
    isWatchlisted,
    isWatched,
    isFavorited,
    newCommentEmotionId,
    newCommentText,
  } = state;

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
      <div class="movie__actions">
        <button class="icon-button icon-button--icon_list-add" aria-pressed="${isWatchlisted}">
          <span class="icon-button__text">Add to watchlist</span>
        </button>
        <button class="icon-button icon-button--icon_checkmark" aria-pressed="${isWatched}">
          <span class="icon-button__text">Already watched</span>
        </button>
        <button class="icon-button icon-button--icon_star" aria-pressed="${isFavorited}">
          <span class="icon-button__text">Add to favorites</span>
        </button>
      </div>
      <section class="movie__comments comments">
        <h3 class="comments__title title title--size_m">Comments ${commentsCount}</h3>
        ${createMovieDetailsCommentListTemplate(comments)}
        ${createMovieDetailsCommentFormTemplate(newCommentEmotionId, newCommentText)}
      </section>
    </article>`
  );
}

export default class MovieDetailsView extends AbstractStatefulView {
  #movie = null;
  #comments = [];
  #onWatchlistButtonClick = null;
  #onWatchedButtonClick = null;
  #onFavoriteButtonClick = null;
  #onCommentFormSubmit = null;

  constructor({
    movie,
    comments,
    onWatchlistButtonClick,
    onWatchedButtonClick,
    onFavoriteButtonClick,
    onCommentFormSubmit,
  }) {
    super();
    this.#movie = movie;
    this.#comments = comments;
    this.#onWatchlistButtonClick = onWatchlistButtonClick;
    this.#onWatchedButtonClick = onWatchedButtonClick;
    this.#onFavoriteButtonClick = onFavoriteButtonClick;
    this.#onCommentFormSubmit = onCommentFormSubmit;

    this._updateState({
      isWatchlisted: this.#movie.isWatchlisted,
      isWatched: this.#movie.isWatched,
      isFavorited: this.#movie.isFavorited,
      newCommentEmotionId: null,
      newCommentText: '',
    });

    this._setHandlers();
  }

  _getTemplate() {
    return createMovieDetailsTemplate({
      movie: this.#movie,
      comments: this.#comments,
      state: this._state,
    });
  }

  _setHandlers() {
    const commentFormElement = this.element.querySelector('.comment-form');

    this.element.querySelector('.icon-button--icon_list-add')
      .addEventListener('click', this.#watchlistButtonClickHandler);

    this.element.querySelector('.icon-button--icon_checkmark')
      .addEventListener('click', this.#watchedButtonClickHandler);

    this.element.querySelector('.icon-button--icon_star')
      .addEventListener('click', this.#favoriteButtonClickHandler);

    commentFormElement.addEventListener('keydown', this.#commentFormKeydownHandler);
    commentFormElement.addEventListener('input', this.#commentFormInputHandler);
    commentFormElement.addEventListener('submit', this.#commentFormSubmitHandler);
  }

  #restoreEmotionFieldFocus() {
    this.element
      .querySelector(`[name="${CommentFormFieldName.EMOTION}"]:checked`)
      .focus();
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

  #commentFormKeydownHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && isEnterEvent(evt)) {
      evt.preventDefault();

      const formElement = evt.currentTarget;
      formElement.requestSubmit();
    }
  };

  #commentFormInputHandler = ({ target: { name, value } }) => {
    switch (name) {
      case CommentFormFieldName.TEXT:
        this._updateState({ newCommentText: value });
        break;
      case CommentFormFieldName.EMOTION:
        this.updateElement({ newCommentEmotionId: value });
        this.#restoreEmotionFieldFocus();
        break;
    }
  };

  #commentFormSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#onCommentFormSubmit({
      emotionId: this._state.newCommentEmotionId,
      text: this._state.newCommentText,
    });
  };
}
