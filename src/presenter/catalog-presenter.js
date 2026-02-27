import { render } from '../framework';
import CatalogFilterView from '../view/catalog-filter-view.js';
import CatalogListView from '../view/catalog-list-view.js';
import CatalogMessage, { MessageVariant } from '../view/catalog-message-view.js';
import CatalogShowMoreButtonView from '../view/catalog-show-more-button-view.js';
import CatalogSortView from '../view/catalog-sort-view.js';
import MovieCardView from '../view/movie-card-view.js';

export default class CatalogPresenter {
  #containerElement = null;
  #model = null;
  #movies = [];

  #movieListComponent = null;

  constructor({ containerElement, model }) {
    this.#containerElement = containerElement;
    this.#model = model;
  }

  init() {
    this.#movies = this.#model.movies;
    this.#render();
  }

  #render() {
    render(new CatalogFilterView(), this.#containerElement);

    if (!this.#movies.length) {
      render(
        new CatalogMessage({ variant: MessageVariant.CatalogEmpty }),
        this.#containerElement,
      );

      return;
    }

    render(new CatalogSortView(), this.#containerElement);
    this.#movieListComponent = new CatalogListView();
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
