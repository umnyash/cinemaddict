import { AbstractView } from '../framework';
import { SortType } from '../constants.js';

const items = [
  { label: 'default', value: SortType.DEFAULT },
  { label: 'date', value: SortType.DATE_DESC },
  { label: 'rating', value: SortType.RATING_DESC },
];

function createCatalogSortTemplate(currentValue) {
  return (
    `<form class="catalog__sort catalog-sort" action="https://echo.htmlacademy.ru/courses" method="get">
      ${items.map(({ label, value }) => `
        <label class="checker checker--simple checker--size_m">
          <input
            class="checker__control visually-hidden"
            name="type"
            value="${value}"
            type="radio"
            ${value === currentValue ? 'checked' : ''}
          >
          <span class="checker__label">Sort by ${label}</span>
        </label>
      `).join('')}
    </form>`
  );
}

export default class CatalogSortView extends AbstractView {
  #value = null;
  #onValueChange = null;

  constructor({ value, onValueChange }) {
    super();

    this.#value = value;
    this.#onValueChange = onValueChange;
    this.element.addEventListener('change', this.#formChangeHandler);
  }

  _getTemplate() {
    return createCatalogSortTemplate(this.#value);
  }

  #formChangeHandler = (evt) => {
    this.#onValueChange(evt.target.value);
  };
}
