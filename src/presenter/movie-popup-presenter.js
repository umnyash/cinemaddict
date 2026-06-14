import { render, remove } from '../framework';
import { EventType, RequestStatus } from '../constants.js';
import { isEscapeEvent } from '../utils';

import MovieDetailsPresenter from './movie-details-presenter.js';
import MoviePopupView from '../view/movie-popup-view.js';
import PopupInnerView from '../view/popup-inner-view.js';

const MOVIE_ID_SEARCH_PARAM = 'movieId';

export default class MoviePopupPresenter {
  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;

  #popupComponent = null;
  #popupInnerComponent = null;
  #moviePresenter = null;
  #uiBlocker = null;

  constructor({ containerElement, moviesModel, commentsModel, uiBlocker }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#uiBlocker = uiBlocker;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  get #isOpen() {
    return this.#popupComponent !== null;
  }

  show(movieId) {
    const isCurrentMovie = this.#moviePresenter?.movieId === movieId;

    if (isCurrentMovie) {
      return;
    }

    this.#setMovieIdInUrl(movieId);

    if (this.#isOpen) {
      this.#moviePresenter.init(movieId);
      this.#popupComponent.resetScroll();
    } else {
      this.#render(movieId);
      this.#open();
    }
  }

  #open() {
    requestAnimationFrame(() => {
      this.#popupComponent.open();
    });

    document.addEventListener('keydown', this.#documentKeyDownHandler);
  }

  async #close() {
    document.removeEventListener('keydown', this.#documentKeyDownHandler);
    this.#removeMovieIdFromUrl();
    await this.#popupComponent.close();
    remove(this.#popupComponent);
    this.#moviePresenter.destroy();

    this.#popupComponent = null;
    this.#popupInnerComponent = null;
    this.#moviePresenter = null;
  }

  #setMovieIdInUrl(movieId) {
    const url = new URL(location.href);
    url.searchParams.set(MOVIE_ID_SEARCH_PARAM, movieId);
    window.history.replaceState({}, '', url);
  }

  #removeMovieIdFromUrl() {
    const url = new URL(location.href);
    url.searchParams.delete(MOVIE_ID_SEARCH_PARAM);
    history.replaceState({}, '', url);
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
      uiBlocker: this.#uiBlocker,
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

  #moviesModelEventHandler = (eventType) => {
    if (eventType === EventType.MOVIES_LOAD && this.#moviesModel.loadingStatus === RequestStatus.SUCCESS) {
      const movieId = new URLSearchParams(location.search).get(MOVIE_ID_SEARCH_PARAM);

      if (movieId) {
        this.show(movieId);
      }
    }
  };
}
