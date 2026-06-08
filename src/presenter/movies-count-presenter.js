import { render } from '../framework';
import { EventType, RequestStatus } from '../constants.js';
import MoviesCountView from '../view/movies-count-view.js';

export default class MoviesCountPresenter {
  #containerElement = null;
  #moviesModel = null;

  constructor({ containerElement, moviesModel }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  get #moviesLoadingStatus() {
    return this.#moviesModel.loadingStatus;
  }

  init() {
    if (this.#moviesLoadingStatus !== RequestStatus.SUCCESS) {
      return;
    }

    const moviesCountComponent = new MoviesCountView({
      count: this.#moviesModel.movies.length
    });

    render(moviesCountComponent, this.#containerElement);
  }

  #moviesModelEventHandler = (eventType) => {
    if (eventType === EventType.MOVIES_LOAD) {
      this.init();
    }
  };
}
