import { render } from '../framework';
import CatalogFilterView from '../view/catalog-filter-view.js';
import CatalogSortingView from '../view/catalog-sorting-view.js';
import CatalogListView from '../view/catalog-list-view.js';
import MovieCardView from '../view/movie-card-view.js';
import CatalogShowMoreButtonView from '../view/catalog-show-more-button-view.js';

export default class CatalogPresenter {
  catalogListComponent = new CatalogListView();

  constructor({ catalogContainerElement, catalogModel }) {
    this.catalogContainerElement = catalogContainerElement;
    this.catalogModel = catalogModel;
  }

  init() {
    this.movies = this.catalogModel.getMovies();

    render(new CatalogFilterView(), this.catalogContainerElement);
    render(new CatalogSortingView(), this.catalogContainerElement);
    render(this.catalogListComponent, this.catalogContainerElement);

    for (let i = 0; i < this.movies.length; i++) {
      render(new MovieCardView(), this.catalogListComponent.getElement());
    }

    render(new CatalogShowMoreButtonView(), this.catalogContainerElement);
  }
}
