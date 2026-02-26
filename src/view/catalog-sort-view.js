import { AbstractView } from '../framework';

function createCatalogSortTemplate() {
  return (
    `<form class="catalog__sort catalog-sort" action="https://echo.htmlacademy.ru/courses" method="get">
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="criterion" value="default" type="radio" checked>
        <span class="checker__label">Sort by default</span>
      </label>
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="criterion" value="date" type="radio">
        <span class="checker__label">Sort by date</span>
      </label>
      <label class="checker checker--simple checker--size_m">
        <input class="checker__control visually-hidden" name="criterion" value="rating" type="radio">
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
