import { render } from '../framework';
import CatalogFilterView from '../view/catalog-filter-view.js';

export default class CatalogFilterPresenter {
  #containerElement = null;
  #filterComponent = null;

  constructor({ containerElement }) {
    this.#containerElement = containerElement;
  }

  init() {
    this.#filterComponent = new CatalogFilterView();
    render(this.#filterComponent, this.#containerElement);
  }
}
