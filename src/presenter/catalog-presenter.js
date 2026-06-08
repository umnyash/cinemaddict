import { render, remove } from '../framework';
import { EventType, MovieStatus, RequestStatus } from '../constants.js';
import { filterMovies, sortMoviesBy } from '../utils';

import MovieCardPresenter from './movie-card-presenter.js';

import CatalogListView from '../view/catalog-list-view.js';
import CatalogMessage, { MessageVariant } from '../view/catalog-message-view.js';
import CatalogShowMoreButtonView from '../view/catalog-show-more-button-view.js';
import CatalogSortView from '../view/catalog-sort-view.js';

const MOVIES_COUNT_PER_STEP = 5;

export default class CatalogPresenter {
  #containerElement = null;
  #moviesModel = null;
  #filterModel = null;
  #renderedMoviesCount = 0;

  #messageComponent = null;
  #sortComponent = null;
  #movieListComponent = null;
  #showMoreButtonComponent = null;

  #sortType = null;
  #movieCardPresenters = new Map();
  #moviePopupPresenter = null;

  constructor({ containerElement, moviesModel, filterModel, moviePopupPresenter }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#moviePopupPresenter = moviePopupPresenter;

    this.#filterModel.addObserver(this.#filterModelEventHandler);
    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  get #filter() {
    return this.#filterModel.filter;
  }

  get #movies() {
    const filteredMovies = filterMovies(this.#moviesModel.movies, this.#filter);

    return this.#sortType
      ? sortMoviesBy(filteredMovies, this.#sortType)
      : filteredMovies;
  }

  get #moviesLoadingStatus() {
    return this.#moviesModel.loadingStatus;
  }

  get #messageVariant() {
    if (this.#moviesLoadingStatus === RequestStatus.PENDING) {
      return MessageVariant.Loading;
    }

    if (this.#moviesLoadingStatus === RequestStatus.ERROR) {
      return MessageVariant.LoadFailed;
    }

    switch (this.#filter.status) {
      case MovieStatus.WATCHLISTED:
        return MessageVariant.WatchlistEmpty;
      case MovieStatus.WATCHED:
        return MessageVariant.HistoryEmpty;
      case MovieStatus.FAVORITED:
        return MessageVariant.FavoritesEmpty;
      default:
        return MessageVariant.CatalogEmpty;
    }
  }

  init() {
    this.#render();
  }

  #renderMessage() {
    this.#messageComponent = new CatalogMessage({ variant: this.#messageVariant });
    render(this.#messageComponent, this.#containerElement);
  }

  #renderSort() {
    this.#sortComponent = new CatalogSortView({
      value: this.#sortType,
      onValueChange: this.#sortChangeHandler,
    });

    render(this.#sortComponent, this.#containerElement);
  }

  #renderMovieCard(movie) {
    const movieCardPresenter = new MovieCardPresenter({
      containerElement: this.#movieListComponent.element,
      onLinkClick: this.#movieCardLinkClickHandler,
      onWatchlistButtonClick: this.#movieWatchlistButtonClickHandler,
      onWatchedButtonClick: this.#movieWatchedButtonClickHandler,
      onFavoriteButtonClick: this.#movieFavoriteButtonClickHandler,
    });

    movieCardPresenter.init(movie);
    this.#movieCardPresenters.set(movie.id, movieCardPresenter);
  }

  #renderMovieCards({ isNext } = {}) {
    const from = isNext ? this.#renderedMoviesCount : 0;

    const count = isNext
      ? MOVIES_COUNT_PER_STEP
      : Math.max(this.#renderedMoviesCount, MOVIES_COUNT_PER_STEP);

    const renderedMoviesMaxCount = Math.min(from + count, this.#movies.length);

    for (let i = from; i < renderedMoviesMaxCount; i++) {
      this.#renderMovieCard(this.#movies[i]);
    }

    this.#renderedMoviesCount = renderedMoviesMaxCount;
  }

  #renderMovieList() {
    this.#movieListComponent = new CatalogListView();
    render(this.#movieListComponent, this.#containerElement);
    this.#renderMovieCards();
  }

  #renderMovies() {
    this.#renderMovieList();

    if (this.#movies.length > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  }

  #renderNextMovies() {
    this.#renderMovieCards({ isNext: true });

    if (this.#renderedMoviesCount === this.#movies.length) {
      this.#destroyShowMoreButton();
    }
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new CatalogShowMoreButtonView({
      onButtonClick: this.#showMoreButtonClickHandler,
    });

    render(this.#showMoreButtonComponent, this.#containerElement);
  }

  #render() {
    if (this.#moviesLoadingStatus === RequestStatus.SUCCESS && this.#movies.length) {
      this.#renderSort();
      this.#renderMovies();
      return;
    }

    this.#renderMessage();
  }

  #destroyMessage() {
    remove(this.#messageComponent);
    this.#messageComponent = null;
  }

  #destroySort() {
    remove(this.#sortComponent);
    this.#sortComponent = null;
  }

  #destroyShowMoreButton() {
    remove(this.#showMoreButtonComponent);
    this.#showMoreButtonComponent = null;
  }

  #destroyMovieList() {
    remove(this.#movieListComponent);
    this.#movieListComponent = null;
    this.#movieCardPresenters.clear();
  }

  #clearMovies() {
    this.#destroyShowMoreButton();
    this.#destroyMovieList();
  }

  #clear() {
    this.#destroyMessage();
    this.#clearMovies();
    this.#destroySort();
  }

  #sortChangeHandler = (value) => {
    this.#sortType = value;
    this.#renderedMoviesCount = 0;
    this.#clearMovies();
    this.#renderMovies();
  };

  #showMoreButtonClickHandler = () => {
    this.#renderNextMovies();
  };

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

  #filterModelEventHandler = () => {
    this.#clear();
    this.#sortType = null;
    this.#renderedMoviesCount = 0;
    this.#render();
  };

  #moviesModelEventHandler = (eventType, data) => {
    switch (true) {
      case eventType === EventType.MOVIE_WATCHLISTED_TOGGLE && this.#filter.status === MovieStatus.WATCHLISTED:
      case eventType === EventType.MOVIE_WATCHED_TOGGLE && this.#filter.status === MovieStatus.WATCHED:
      case eventType === EventType.MOVIE_FAVORITED_TOGGLE && this.#filter.status === MovieStatus.FAVORITED:
      case eventType === EventType.MOVIES_LOAD:
        this.#clear();
        this.#render();
        break;
      default:
        this.#movieCardPresenters.get(data.id)?.init(data);
    }
  };
}
