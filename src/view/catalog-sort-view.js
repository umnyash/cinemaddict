import { createElement } from '../framework';

function createCatalogSortTemplate() {
  return (
    `<form class="catalog__sort catalog-sort" action="https://echo.htmlacademy.ru/courses" method="get">
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="type" value="default" type="radio" checked>
        <span class="checker__label">Sort by default</span>
      </label>
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="type" value="date-desc" type="radio">
        <span class="checker__label">Sort by date</span>
      </label>
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="type" value="rating-desc" type="radio">
        <span class="checker__label">Sort by rating</span>
      </label>
    </form>`
  );
}

export default class CatalogSortView {
  #element = null;

  _getTemplate() {
    return createCatalogSortTemplate();
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
