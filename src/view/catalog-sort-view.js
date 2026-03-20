import { AbstractView } from '../framework';
import { SortType } from '../constants.js';

function createCatalogSortTemplate() {
  return (
    `<form class="catalog__sort catalog-sort" action="https://echo.htmlacademy.ru/courses" method="get">
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="type" value="${SortType.DEFAULT}" type="radio" checked>
        <span class="checker__label">Sort by default</span>
      </label>
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="type" value="${SortType.DATE_DESC}" type="radio">
        <span class="checker__label">Sort by date</span>
      </label>
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="type" value="${SortType.RATING_DESC}" type="radio">
        <span class="checker__label">Sort by rating</span>
      </label>
    </form>`
  );
}

export default class CatalogSortView extends AbstractView {
  _getTemplate() {
    return createCatalogSortTemplate();
  }
}
