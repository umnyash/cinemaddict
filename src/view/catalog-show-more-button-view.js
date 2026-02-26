import { createElement } from '../framework';

function createCatalogShowMoreButtonTemplate() {
  return (
    `<button class="catalog__show-more-button button button--secondary button--size_m">
      Show more
    </button>`
  );
}

export default class CatalogShowMoreButtonView {
  #element = null;

  _getTemplate() {
    return createCatalogShowMoreButtonTemplate();
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
