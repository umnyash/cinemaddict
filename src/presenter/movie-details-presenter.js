import { render, replace, remove } from '../framework';
import { EventType } from '../constants.js';

import MovieDetailsView from '../view/movie-details-view.js';
import MovieActionsView from '../view/movie-actions-view.js';
import MovieCommentsView from '../view/movie-comments-view.js';

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
    this.#commentsModel.addObserver(this.#commentsModelEventHandler);
  }

  get movieId() {
    return this.#movieId;
  }

  get #movie() {
    return this.#moviesModel.getMovieById(this.#movieId);
  }

  get #comments() {
    return this.#commentsModel.get(this.#movieId, this.#movie.commentsCount);
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

    const commentsComponent = new MovieCommentsView({
      comments: this.#comments,
      onCommentFormSubmit: this.#commentFormSubmitHandler,
    });

    this.#renderActions();
    render(commentsComponent, this.#detailsComponent.element);
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
    this.#moviesModel.updateMovie(EventType.MOVIE_WATCHLISTED_TOGGLE, {
      ...this.#movie,
      isWatchlisted: !this.#movie.isWatchlisted,
    });
  };

  #watchedButtonClickHandler = () => {
    this.#moviesModel.updateMovie(EventType.MOVIE_WATCHED_TOGGLE, {
      ...this.#movie,
      isWatched: !this.#movie.isWatched,
    });
  };

  #favoriteButtonClickHandler = () => {
    this.#moviesModel.updateMovie(EventType.MOVIE_FAVORITED_TOGGLE, {
      ...this.#movie,
      isFavorited: !this.#movie.isFavorited,
    });
  };

  #commentFormSubmitHandler = (commentData) => {
    this.#commentsModel.createComment(this.#movieId, commentData);
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
      default:
        this.#clear();
        this.#render();
    }
  };

  #commentsModelEventHandler = (eventType, movieId) => {
    const isCurrentMovie = this.#movieId === movieId;

    if (!isCurrentMovie) {
      return;
    }

    switch (eventType) {
      case EventType.COMMENT_CREATE:
        this.#moviesModel.updateMovie(eventType, {
          ...this.#movie,
          commentsCount: this.#movie.commentsCount + 1,
        });
        break;
    }
  };
}
