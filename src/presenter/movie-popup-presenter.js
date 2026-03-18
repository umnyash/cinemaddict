import { render, remove } from '../framework';
import { isEscapeEvent } from '../utils.js';
import MoviePopupView from '../view/movie-popup-view.js';

export default class MoviePopupPresenter {
  #containerElement = null;
  #onPopupClose = null;

  #movie = null;
  #comments = null;
  #popupComponent = null;

  constructor({ containerElement, onPopupClose }) {
    this.#containerElement = containerElement;
    this.#onPopupClose = onPopupClose;
  }

  init({ movie, comments }) {
    this.#movie = movie;
    this.#comments = comments;

    this.#popupComponent = new MoviePopupView({
      movie: this.#movie,
      comments: this.#comments,
      onCloseButtonClick: this.#closeButtonClickHandler,
    });

    render(this.#popupComponent, this.#containerElement);
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
