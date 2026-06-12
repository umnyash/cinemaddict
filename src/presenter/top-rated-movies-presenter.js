import { render } from '../framework';
import { EventType } from '../constants.js';
import { getTopMovies } from '../utils';
import MovieCardPresenter from './movie-card-presenter.js';
import MovieListView from '../view/movie-list-view.js';
import TopRatedMoviesView from '../view/top-rated-movies-view.js';

const TOP_MOVIES_LIMIT = 2;

export default class TopRatedMoviesPresenter {
  #containerElement = null;
  #moviesModel = null;
  #moviePopupPresenter = null;
  #uiBlocker = null;

  #movies = [];
  #movieCardPresenters = new Map();

  constructor({ containerElement, moviesModel, moviePopupPresenter, uiBlocker }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#moviePopupPresenter = moviePopupPresenter;
    this.#uiBlocker = uiBlocker;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  init() {
    this.#movies = getTopMovies(this.#moviesModel.movies, ({ rating }) => rating, TOP_MOVIES_LIMIT);

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
    const sectionComponent = new TopRatedMoviesView();
    const movieListComponent = new MovieListView();

    this.#movies.forEach((movie) => {
      this.#renderMovieCard(movie, movieListComponent);
    });

    render(movieListComponent, sectionComponent.element);
    render(sectionComponent, this.#containerElement);
  }

  #movieCardLinkClickHandler = (movieId) => {
    this.#moviePopupPresenter.show(movieId);
  };

  #movieWatchlistButtonClickHandler = async (movieId) => {
    this.#uiBlocker.block();

    try {
      await this.#moviesModel.toggleWatchlistedStatus(movieId);
    } catch {
      this.#movieCardPresenters.get(movieId).setFailed();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #movieWatchedButtonClickHandler = async (movieId) => {
    this.#uiBlocker.block();

    try {
      await this.#moviesModel.toggleWatchedStatus(movieId);
    } catch {
      this.#movieCardPresenters.get(movieId).setFailed();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #movieFavoriteButtonClickHandler = async (movieId) => {
    this.#uiBlocker.block();

    try {
      await this.#moviesModel.toggleFavoritedStatus(movieId);
    } catch {
      this.#movieCardPresenters.get(movieId).setFailed();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #moviesModelEventHandler = (eventType, data) => {
    if (eventType === EventType.MOVIES_LOAD) {
      this.init();
      return;
    }

    this.#movieCardPresenters.get(data.id)?.init(data);
  };
}
