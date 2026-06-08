import { render, remove } from '../framework';
import { EventType, RequestStatus } from '../constants.js';
import { calcMovieCountsByStatus } from '../utils/movie-filter.js';
import CatalogFilterView from '../view/catalog-filter-view.js';

export default class CatalogFilterPresenter {
  #containerElement = null;
  #filterModel = null;
  #moviesModel = null;

  #filterComponent = null;

  constructor({ containerElement, filterModel, moviesModel }) {
    this.#containerElement = containerElement;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  get #moviesLoadingStatus() {
    return this.#moviesModel.loadingStatus;
  }

  init() {
    remove(this.#filterComponent);

    const movieCountsByStatus = this.#moviesLoadingStatus === RequestStatus.SUCCESS
      ? calcMovieCountsByStatus(this.#moviesModel.movies)
      : null;

    this.#filterComponent = new CatalogFilterView({
      filter: this.#filterModel.filter,
      movieCountsByStatus,
      onFilterChange: this.#filterChangeHandler,
    });

    render(this.#filterComponent, this.#containerElement);
  }

  #filterChangeHandler = (filter) => {
    this.#filterModel.filter = filter;
  };

  #moviesModelEventHandler = (eventType) => {
    if (eventType === EventType.MOVIE_WATCHLISTED_TOGGLE ||
      eventType === EventType.MOVIE_WATCHED_TOGGLE ||
      eventType === EventType.MOVIE_FAVORITED_TOGGLE ||
      eventType === EventType.MOVIES_LOAD
    ) {
      this.init();
    }
  };
}
