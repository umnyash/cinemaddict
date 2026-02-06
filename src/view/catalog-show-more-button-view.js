import { createElement } from '../framework';

function createCatalogShowMoreButtonTemplate() {
  return (
    `<button class="catalog__show-more-button button button--secondary button--size_m">
      Show more
    </button>`
  );
}

export default class CatalogShowMoreButtonView {
  getTemplate() {
    return createCatalogShowMoreButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
