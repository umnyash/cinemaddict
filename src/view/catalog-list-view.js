import { createElement } from '../framework';

function createCatalogListTemplate() {
  return '<ul class="catalog__list movies-list"></ul>';
}

export default class CatalogListView {
  #element = null;

  _getTemplate() {
    return createCatalogListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this._getTemplate());
    }

    return this.#element;
  }

  getElement() {
    return this.element;
  }
}
