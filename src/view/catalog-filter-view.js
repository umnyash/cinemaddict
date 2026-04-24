import { AbstractView } from '../framework';
import { MovieStatus } from '../constants.js';

function createCatalogFilterTemplate() {
  return (
    `<form class="catalog__filter catalog-filter" action="https://echo.htmlacademy.ru/courses" method="get">
      <label class="catalog-filter__button checker checker--simple checker--size_l">
        <input class="checker__control visually-hidden" name="status" value="" type="radio" checked>
        <span class="checker__label">All movies</span>
      </label>
      <label class="catalog-filter__button checker checker--simple checker--size_l">
        <input class="checker__control visually-hidden" name="status" value="${MovieStatus.WATCHLISTED}" type="radio">
        <span class="checker__label">
          Watchlist <span class="checker__counter">12</span>
        </span>
      </label>
      <label class="catalog-filter__button checker checker--simple checker--size_l">
        <input class="checker__control visually-hidden" name="status" value="${MovieStatus.WATCHED}" type="radio">
        <span class="checker__label">
          History <span class="checker__counter">7</span>
        </span>
      </label>
      <label class="catalog-filter__button checker checker--simple checker--size_l">
        <input class="checker__control visually-hidden" name="status" value="${MovieStatus.FAVORITED}" type="radio">
        <span class="checker__label">
          Favorites <span class="checker__counter">3</span>
        </span>
      </label>
    </form>`
  );
}

export default class CatalogFilterView extends AbstractView {
  _getTemplate() {
    return createCatalogFilterTemplate();
  }
}
