import { render, remove } from '../framework';
import { isEscapeEvent } from '../utils';

import MovieDetailsPresenter from './movie-details-presenter.js';
import MoviePopupView from '../view/movie-popup-view.js';
import PopupInnerView from '../view/popup-inner-view.js';

export default class MoviePopupPresenter {
  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;

  #popupComponent = null;
  #popupInnerComponent = null;
  #moviePresenter = null;

  constructor({ containerElement, moviesModel, commentsModel }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
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
    const isCurrentMovie = this.#moviePresenter?.movieId === movieId;

    if (isCurrentMovie) {
      return;
    }

    if (this.#isOpen) {
      this.#moviePresenter.init(movieId);
      this.#popupComponent.resetScroll();
    } else {
      this.#render(movieId);
      this.#open();
    }
  }

  async #close() {
    document.removeEventListener('keydown', this.#documentKeyDownHandler);
    await this.#popupComponent.close();
    remove(this.#popupComponent);
    this.#moviePresenter.destroy();

    this.#popupComponent = null;
    this.#popupInnerComponent = null;
    this.#moviePresenter = null;
  }

  #render(movieId) {
    this.#popupComponent = new MoviePopupView();

    this.#popupInnerComponent = new PopupInnerView({
      onCloseButtonClick: this.#closeButtonClickHandler,
    });

    this.#renderMovie(movieId);
    render(this.#popupInnerComponent, this.#popupComponent.element);
    render(this.#popupComponent, this.#containerElement);
  }

  #renderMovie(movieId) {
    this.#moviePresenter = new MovieDetailsPresenter({
      containerElement: this.#popupInnerComponent.element,
      moviesModel: this.#moviesModel,
      commentsModel: this.#commentsModel,
    });

    this.#moviePresenter.init(movieId);
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
