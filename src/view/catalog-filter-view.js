import { AbstractView } from '../framework';
import { MovieStatus } from '../constants.js';

const movieStatusButtons = [
  { label: 'All movies', value: '' },
  { label: 'Watchlist', value: MovieStatus.WATCHLISTED },
  { label: 'History', value: MovieStatus.WATCHED },
  { label: 'Favorites', value: MovieStatus.FAVORITED },
];

function createCatalogFilterMovieStatusButtonTemplate({ label, value }, currentValue, movieCountsByStatus) {
  const labelTextTemplate = value
    ? `${label} <span class="checker__counter">${movieCountsByStatus[value]}</span>`
    : label;

  const isChecked = value ? value === currentValue : !currentValue;

  return (
    `<label class="catalog-filter__button checker checker--simple checker--size_l">
      <input
        class="checker__control visually-hidden"
        name="status"
        value="${value}"
        type="radio"
        ${isChecked ? 'checked' : ''}
      >
      <span class="checker__label">${labelTextTemplate}</span>
    </label>`
  );
}

function createCatalogFilterTemplate(filter, movieCountsByStatus) {
  const { status } = filter;

  return (
    `<form class="catalog__filter catalog-filter" action="https://echo.htmlacademy.ru/courses" method="get">
      ${movieStatusButtons.map((button) => createCatalogFilterMovieStatusButtonTemplate(button, status, movieCountsByStatus)).join('')}
    </form>`
  );
}

export default class CatalogFilterView extends AbstractView {
  #filter = null;
  #movieCountsByStatus = null;
  #onFilterChange = null;

  constructor({ filter, movieCountsByStatus, onFilterChange }) {
    super();
    this.#filter = filter;
    this.#movieCountsByStatus = movieCountsByStatus;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#formChangeHandler);
  }

  _getTemplate() {
    return createCatalogFilterTemplate(this.#filter, this.#movieCountsByStatus);
  }

  #formChangeHandler = ({ target: { value } }) => {
    this.#onFilterChange({
      status: value || null,
    });
  };
}
