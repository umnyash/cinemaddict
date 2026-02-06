import { createElement } from '../framework';

function createCatalogListTemplate() {
  return '<ul class="catalog__list movies-list"></ul>';
}

export default class CatalogListView {
  getTemplate() {
    return createCatalogListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
