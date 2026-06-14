import { render, replace, remove } from '../framework';
import { EventType } from '../constants.js';

import MovieCommentsPresenter from './movie-comments-presenter.js';

import MovieDetailsView from '../view/movie-details-view.js';
import MovieActionsView from '../view/movie-actions-view.js';
import MovieNotFoundView from '../view/movie-not-found-view.js';

export default class MovieDetailsPresenter {
  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;
  #uiBlocker = null;

  #movieId = null;
  #detailsComponent = null;
  #actionsComponent = null;
  #notFoundComponent = null;

  #commentsPresenter = null;

  constructor({ containerElement, moviesModel, commentsModel, uiBlocker }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#uiBlocker = uiBlocker;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  get movieId() {
    return this.#movieId;
  }

  get #movie() {
    return this.#moviesModel.getMovieById(this.#movieId);
  }

  init(movieId) {
    this.#movieId = movieId;

    if (this.#detailsComponent || this.#notFoundComponent) {
      this.destroy();
    }

    this.#render();
  }

  destroy() {
    this.#commentsPresenter?.destroy();
    this.#commentsPresenter = null;
    this.#moviesModel.removeObserver(this.#moviesModelEventHandler);
    remove(this.#detailsComponent);
    remove(this.#notFoundComponent);
    this.#detailsComponent = null;
    this.#actionsComponent = null;
    this.#notFoundComponent = null;
  }

  #render() {
    if (!this.#movie) {
      this.#notFoundComponent = new MovieNotFoundView();
      render(this.#notFoundComponent, this.#containerElement);
      return;
    }

    this.#detailsComponent = new MovieDetailsView({ movie: this.#movie });

    this.#commentsPresenter = new MovieCommentsPresenter({
      containerElement: this.#detailsComponent.element,
      commentsModel: this.#commentsModel,
      movieId: this.#movieId,
      uiBlocker: this.#uiBlocker,
    });

    this.#renderActions();
    this.#commentsPresenter.init();
    render(this.#detailsComponent, this.#containerElement);
  }

  #renderActions() {
    this.#actionsComponent = this.#createActionsComponent();
    render(this.#actionsComponent, this.#detailsComponent.element);
  }

  #rerenderActions() {
    const newActionsComponent = this.#createActionsComponent();
    replace(newActionsComponent, this.#actionsComponent);
    this.#actionsComponent = newActionsComponent;
  }

  #createActionsComponent() {
    return new MovieActionsView({
      isWatchlisted: this.#movie.isWatchlisted,
      isWatched: this.#movie.isWatched,
      isFavorited: this.#movie.isFavorited,
      onWatchlistButtonClick: this.#watchlistButtonClickHandler,
      onWatchedButtonClick: this.#watchedButtonClickHandler,
      onFavoriteButtonClick: this.#favoriteButtonClickHandler,
    });
  }

  #watchlistButtonClickHandler = async () => {
    this.#uiBlocker.block();

    try {
      await this.#moviesModel.toggleWatchlistedStatus(this.#movieId);
    } catch {
      this.#actionsComponent.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #watchedButtonClickHandler = async () => {
    this.#uiBlocker.block();

    try {
      await this.#moviesModel.toggleWatchedStatus(this.#movieId);
    } catch {
      this.#actionsComponent.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #favoriteButtonClickHandler = async () => {
    this.#uiBlocker.block();

    try {
      await this.#moviesModel.toggleFavoritedStatus(this.#movieId);
    } catch {
      this.#actionsComponent.shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #moviesModelEventHandler = (eventType, data) => {
    if ((eventType === EventType.MOVIE_WATCHLISTED_TOGGLE ||
      eventType === EventType.MOVIE_WATCHED_TOGGLE ||
      eventType === EventType.MOVIE_FAVORITED_TOGGLE) &&
      this.#movieId === data.id) {
      this.#rerenderActions();
    }
  };
}
