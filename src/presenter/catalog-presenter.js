import { render } from '../framework';
import CatalogFilterView from '../view/catalog-filter-view.js';
import CatalogListView from '../view/catalog-list-view.js';
import CatalogShowMoreButtonView from '../view/catalog-show-more-button-view.js';
import CatalogSortingView from '../view/catalog-sorting-view.js';
import MovieCardView from '../view/movie-card-view.js';

export default class CatalogPresenter {
  #containerElement = null;
  #model = null;
  #movies = [];

  #movieListComponent = new CatalogListView();

  constructor({ containerElement, model }) {
    this.#containerElement = containerElement;
    this.#model = model;
  }

  init() {
    this.#movies = this.#model.movies;

    render(new CatalogFilterView(), this.#containerElement);
    render(new CatalogSortingView(), this.#containerElement);
    render(this.#movieListComponent, this.#containerElement);

    for (let i = 0; i < this.#movies.length; i++) {
      render(
        new MovieCardView({ movie: this.#movies[i] }),
        this.#movieListComponent.element,
      );
    }

    render(new CatalogShowMoreButtonView(), this.#containerElement);
  }
}
