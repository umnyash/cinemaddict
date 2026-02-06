import { render } from '../framework';
import CatalogFilterView from '../view/catalog-filter-view.js';
import CatalogListView from '../view/catalog-list-view.js';
import CatalogShowMoreButtonView from '../view/catalog-show-more-button-view.js';
import CatalogSortView from '../view/catalog-sort-view.js';
import MovieCardView from '../view/movie-card-view.js';

const MOVIES_COUNT = 5;

export default class CatalogPresenter {
  movieListComponent = new CatalogListView();

  constructor({ containerElement }) {
    this.containerElement = containerElement;
  }

  init() {
    render(new CatalogFilterView(), this.containerElement);
    render(new CatalogSortView(), this.containerElement);
    render(this.movieListComponent, this.containerElement);

    for (let i = 0; i < MOVIES_COUNT; i++) {
      render(new MovieCardView(), this.movieListComponent.getElement());
    }

    render(new CatalogShowMoreButtonView(), this.containerElement);
  }
}
