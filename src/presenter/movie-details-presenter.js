import { render, replace, remove } from '../framework';
import { EventType } from '../constants.js';

import MovieCommentsPresenter from './movie-comments-presenter.js';

import MovieDetailsView from '../view/movie-details-view.js';
import MovieActionsView from '../view/movie-actions-view.js';

export default class MovieDetailsPresenter {
  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;

  #movieId = null;
  #detailsComponent = null;
  #actionsComponent = null;

  constructor({ containerElement, moviesModel, commentsModel }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;

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

    if (this.#detailsComponent) {
      this.#clear();
    }

    this.#render();
  }

  #render() {
    this.#detailsComponent = new MovieDetailsView({ movie: this.#movie });

    const commentsPresenter = new MovieCommentsPresenter({
      containerElement: this.#detailsComponent.element,
      commentsModel: this.#commentsModel,
      movieId: this.#movieId,
      initialCommentsCount: this.#movie.commentsCount,
    });

    this.#renderActions();
    commentsPresenter.init();
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

  #clear() {
    remove(this.#detailsComponent);
    this.#detailsComponent = null;
  }

  #watchlistButtonClickHandler = () => {
    this.#moviesModel.toggleWatchlistedStatus(this.#movieId);
  };

  #watchedButtonClickHandler = () => {
    this.#moviesModel.toggleWatchedStatus(this.#movieId);
  };

  #favoriteButtonClickHandler = () => {
    this.#moviesModel.toggleFavoritedStatus(this.#movieId);
  };

  #moviesModelEventHandler = (eventType, updatedMovie) => {
    const isCurrentMovie = this.#movieId === updatedMovie.id;

    if (!isCurrentMovie) {
      return;
    }

    switch (eventType) {
      case EventType.MOVIE_WATCHLISTED_TOGGLE:
      case EventType.MOVIE_WATCHED_TOGGLE:
      case EventType.MOVIE_FAVORITED_TOGGLE:
        this.#rerenderActions();
        break;
    }
  };
}
