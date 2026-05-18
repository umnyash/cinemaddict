import { AbstractView } from '../framework';

function createMovieActionsTemplate({ isWatchlisted, isWatched, isFavorited }) {
  return (
    `<div class="movie__actions">
      <button class="icon-button icon-button--icon_list-add" aria-pressed="${isWatchlisted}">
        <span class="icon-button__text">Add to watchlist</span>
      </button>
      <button class="icon-button icon-button--icon_checkmark" aria-pressed="${isWatched}">
        <span class="icon-button__text">Already watched</span>
      </button>
      <button class="icon-button icon-button--icon_star" aria-pressed="${isFavorited}">
        <span class="icon-button__text">Add to favorites</span>
      </button>
    </div>`
  );
}

export default class MovieActions extends AbstractView {
  #isWatchlisted = null;
  #isWatched = null;
  #isFavorited = null;
  #onWatchlistButtonClick = null;
  #onWatchedButtonClick = null;
  #onFavoriteButtonClick = null;

  constructor({
    isWatchlisted,
    isWatched,
    isFavorited,
    onWatchlistButtonClick,
    onWatchedButtonClick,
    onFavoriteButtonClick,
  }) {
    super();

    this.#isWatchlisted = isWatchlisted;
    this.#isWatched = isWatched;
    this.#isFavorited = isFavorited;
    this.#onWatchlistButtonClick = onWatchlistButtonClick;
    this.#onWatchedButtonClick = onWatchedButtonClick;
    this.#onFavoriteButtonClick = onFavoriteButtonClick;

    this.element.querySelector('.icon-button--icon_list-add')
      .addEventListener('click', this.#watchlistButtonClickHandler);

    this.element.querySelector('.icon-button--icon_checkmark')
      .addEventListener('click', this.#watchedButtonClickHandler);

    this.element.querySelector('.icon-button--icon_star')
      .addEventListener('click', this.#favoriteButtonClickHandler);
  }

  _getTemplate() {
    return createMovieActionsTemplate({
      isWatchlisted: this.#isWatchlisted,
      isWatched: this.#isWatched,
      isFavorited: this.#isFavorited,
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
}
