import { render, remove } from '../framework';
import { isEscapeEvent } from '../utils';
import MoviePopupView from '../view/movie-popup-view.js';

export default class MoviePopupPresenter {
  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;

  #movieId = null;
  #popupComponent = null;

  constructor({ containerElement, moviesModel, commentsModel }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  get #movie() {
    return this.#moviesModel.getMovieById(this.#movieId);
  }

  get #comments() {
    return this.#commentsModel.get(this.#movieId, this.#movie.commentsCount);
  }

  get #isOpen() {
    return this.#popupComponent !== null;
  }

  #open() {
    requestAnimationFrame(() => {
      this.#popupComponent.open();
    });

    document.addEventListener('keydown', this.#documentKeyDownHandler);
  }

  show(movieId) {
    const isCurrentMovie = this.#movieId === movieId;

    if (isCurrentMovie) {
      return;
    }

    this.#movieId = movieId;

    if (this.#isOpen) {
      remove(this.#popupComponent);
      this.#render({ isOpen: true });
    } else {
      this.#render();
      this.#open();
    }
  }

  async #close() {
    document.removeEventListener('keydown', this.#documentKeyDownHandler);
    await this.#popupComponent.close();
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#movieId = null;
  }

  #render({ isOpen = false } = {}) {
    this.#popupComponent = new MoviePopupView({
      movie: this.#movie,
      comments: this.#comments,
      isOpen,
      onWatchlistButtonClick: this.#watchlistButtonClickHandler,
      onWatchedButtonClick: this.#watchedButtonClickHandler,
      onFavoriteButtonClick: this.#favoriteButtonClickHandler,
      onCloseButtonClick: this.#closeButtonClickHandler,
    });

    render(this.#popupComponent, this.#containerElement);

    if (isOpen) {
      document.addEventListener('keydown', this.#documentKeyDownHandler);
    }
  }

  #update() {
    this.#popupComponent.updateElement({
      isWatchlisted: this.#movie.isWatchlisted,
      isWatched: this.#movie.isWatched,
      isFavorited: this.#movie.isFavorited,
    });
  }

  #watchlistButtonClickHandler = () => {
    this.#moviesModel.updateMovie({
      ...this.#movie,
      isWatchlisted: !this.#movie.isWatchlisted,
    });
  };

  #watchedButtonClickHandler = () => {
    this.#moviesModel.updateMovie({
      ...this.#movie,
      isWatched: !this.#movie.isWatched,
    });
  };

  #favoriteButtonClickHandler = () => {
    this.#moviesModel.updateMovie({
      ...this.#movie,
      isFavorited: !this.#movie.isFavorited,
    });
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

  #moviesModelEventHandler = (_eventType, updatedMovie) => {
    const isCurrentMovie = this.#movieId === updatedMovie.id;

    if (!isCurrentMovie) {
      return;
    }

    this.#update();
  };
}
