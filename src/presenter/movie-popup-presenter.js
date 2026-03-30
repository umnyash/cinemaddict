import { render, remove } from '../framework';
import { isEscapeEvent } from '../utils';
import MoviePopupView from '../view/movie-popup-view.js';

export default class MoviePopupPresenter {
  #containerElement = null;
  #onPopupClose = null;
  #onDataChange = null;

  #movie = null;
  #comments = null;
  #popupComponent = null;
  #popupScrollTop = 0;

  constructor({ containerElement, onPopupClose, onDataChange }) {
    this.#containerElement = containerElement;
    this.#onPopupClose = onPopupClose;
    this.#onDataChange = onDataChange;
  }

  get movieId() {
    return this.#movie?.id;
  }

  init({ movie, comments }) {
    const isSameMovie = this.#movie?.id === movie.id;

    this.#movie = movie;
    this.#comments = comments;

    if (!this.#popupComponent) {
      this.#render();
      return;
    }

    if (isSameMovie) {
      this.#popupComponent.updateElement({
        isOnWatchlist: this.#movie.isOnWatchlist,
        isWatched: this.#movie.isWatched,
        isFavorite: this.#movie.isFavorite,
      });
    } else {
      remove(this.#popupComponent);
      this.#render(true);
    }

    if (isSameMovie) {
      this.#popupComponent.setScrollTop(this.#popupScrollTop);
    } else {
      this.#popupScrollTop = 0;
    }
  }

  open() {
    requestAnimationFrame(() => {
      this.#popupComponent.open();
    });

    document.addEventListener('keydown', this.#documentKeyDownHandler);
  }

  async #close() {
    document.removeEventListener('keydown', this.#documentKeyDownHandler);
    await this.#popupComponent.close();
    remove(this.#popupComponent);
    this.#onPopupClose();
  }

  #render(isOpen) {
    this.#popupComponent = new MoviePopupView({
      movie: this.#movie,
      comments: this.#comments,
      isOpen,
      onWatchlistButtonClick: this.#watchlistButtonClickHandler,
      onWatchedButtonClick: this.#watchedButtonClickHandler,
      onFavoriteButtonClick: this.#favoriteButtonClickHandler,
      onPopupScroll: this.#popupScrollHandler,
      onCloseButtonClick: this.#closeButtonClickHandler,
    });

    render(this.#popupComponent, this.#containerElement);
  }

  #watchlistButtonClickHandler = () => {
    this.#onDataChange({
      ...this.#movie,
      isOnWatchlist: !this.#movie.isOnWatchlist,
    });
  };

  #watchedButtonClickHandler = () => {
    this.#onDataChange({
      ...this.#movie,
      isWatched: !this.#movie.isWatched,
    });
  };

  #favoriteButtonClickHandler = () => {
    this.#onDataChange({
      ...this.#movie,
      isFavorite: !this.#movie.isFavorite,
    });
  };

  #popupScrollHandler = (scrollTop) => {
    this.#popupScrollTop = scrollTop;
  };

  #closeButtonClickHandler = () => {
    this.#close();
  };

  #documentKeyDownHandler = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#close();
    }
  };
}
