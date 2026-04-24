import { render } from '../framework';
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
  }

  init() {
    this.#filterComponent = new CatalogFilterView({
      filter: this.#filterModel.filter,
      movieCountsByStatus: calcMovieCountsByStatus(this.#moviesModel.movies),
    });

    render(this.#filterComponent, this.#containerElement);
  }
}
