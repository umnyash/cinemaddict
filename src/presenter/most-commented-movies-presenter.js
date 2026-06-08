import { render, remove } from '../framework';
import { EventType } from '../constants.js';
import { getTopMovies } from '../utils';

import MovieCardPresenter from './movie-card-presenter.js';
import MostCommentedMoviesView from '../view/most-commented-movies-view.js';
import MovieListView from '../view/movie-list-view.js';

const TOP_MOVIES_LIMIT = 2;

export default class TopRatedMoviesPresenter {
  #containerElement = null;
  #moviesModel = null;
  #moviePopupPresenter = null;

  #movies = [];
  #sectionComponent = null;
  #movieCardPresenters = new Map();

  constructor({ containerElement, moviesModel, moviePopupPresenter }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#moviePopupPresenter = moviePopupPresenter;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  init() {
    if (this.#sectionComponent) {
      this.#destroy();
    }

    this.#movies = getTopMovies(
      this.#moviesModel.movies,
      ({ commentsCount }) => commentsCount, TOP_MOVIES_LIMIT,
    );

    if (this.#movies.length) {
      this.#render();
    }
  }

  #renderMovieCard(movie, containerElement) {
    const movieCardPresenter = new MovieCardPresenter({
      containerElement: containerElement.element,
      onLinkClick: this.#movieCardLinkClickHandler,
      onWatchlistButtonClick: this.#movieWatchlistButtonClickHandler,
      onWatchedButtonClick: this.#movieWatchedButtonClickHandler,
      onFavoriteButtonClick: this.#movieFavoriteButtonClickHandler,
    });

    movieCardPresenter.init(movie);
    this.#movieCardPresenters.set(movie.id, movieCardPresenter);
  }

  #render() {
    this.#sectionComponent = new MostCommentedMoviesView();
    const movieListComponent = new MovieListView();

    this.#movies.forEach((movie) => {
      this.#renderMovieCard(movie, movieListComponent);
    });

    render(movieListComponent, this.#sectionComponent.element);
    render(this.#sectionComponent, this.#containerElement);
  }

  #destroy() {
    remove(this.#sectionComponent);
    this.#movieCardPresenters.clear();
  }

  #movieCardLinkClickHandler = (movieId) => {
    this.#moviePopupPresenter.show(movieId);
  };

  #movieWatchlistButtonClickHandler = async (movieId) => {
    try {
      await this.#moviesModel.toggleWatchlistedStatus(movieId);
    } catch {
      this.#movieCardPresenters.get(movieId).setFailed();
    }
  };

  #movieWatchedButtonClickHandler = async (movieId) => {
    try {
      await this.#moviesModel.toggleWatchedStatus(movieId);
    } catch {
      this.#movieCardPresenters.get(movieId).setFailed();
    }
  };

  #movieFavoriteButtonClickHandler = async (movieId) => {
    try {
      await this.#moviesModel.toggleFavoritedStatus(movieId);
    } catch {
      this.#movieCardPresenters.get(movieId).setFailed();
    }
  };

  #moviesModelEventHandler = (eventType, data) => {
    switch (eventType) {
      case EventType.MOVIE_COMMENTS_UPDATE:
      case EventType.MOVIES_LOAD:
        this.init();
        break;
      default:
        this.#movieCardPresenters.get(data.id)?.init(data);
    }
  };
}
