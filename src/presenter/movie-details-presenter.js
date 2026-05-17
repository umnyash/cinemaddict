import { render, remove } from '../framework';
import { EventType } from '../constants.js';

import MovieDetailsView from '../view/movie-details-view.js';

export default class MovieDetailsPresenter {
  #containerElement = null;
  #moviesModel = null;
  #commentsModel = null;

  #movieId = null;
  #detailsComponent = null;

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
    this.#detailsComponent = new MovieDetailsView({
      movie: this.#movie,
      comments: this.#comments,
      onWatchlistButtonClick: this.#watchlistButtonClickHandler,
      onWatchedButtonClick: this.#watchedButtonClickHandler,
      onFavoriteButtonClick: this.#favoriteButtonClickHandler,
      onCommentFormSubmit: this.#commentFormSubmitHandler,
    });

    render(this.#detailsComponent, this.#containerElement);
  }

  #clear() {
    remove(this.#detailsComponent);
    this.#detailsComponent = null;
  }

  #update() {
    this.#detailsComponent.updateElement({
      isWatchlisted: this.#movie.isWatchlisted,
      isWatched: this.#movie.isWatched,
      isFavorited: this.#movie.isFavorited,
    });
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
        this.#update();
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
