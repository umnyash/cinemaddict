import { createElement } from '../framework';

function createCatalogFilterTemplate() {
  return (
    `<div class="catalog__filter-wrapper">
      <form class="catalog__filter catalog-filter" action="https://echo.htmlacademy.ru/courses" method="get">
        <label class="catalog-filter__button checker checker--simple checker--size_l">
          <input class="checker__control visually-hidden" name="status" value="all" type="radio" checked>
          <span class="checker__label">All movies</span>
        </label>
        <label class="catalog-filter__button checker checker--simple checker--size_l">
          <input class="checker__control visually-hidden" name="status" value="to_watch" type="radio">
          <span class="checker__label">
            Watchlist <span class="checker__counter">12</span>
          </span>
        </label>
        <label class="catalog-filter__button checker checker--simple checker--size_l">
          <input class="checker__control visually-hidden" name="status" value="watched" type="radio">
          <span class="checker__label">
            History <span class="checker__counter">7</span>
          </span>
        </label>
        <label class="catalog-filter__button checker checker--simple checker--size_l">
          <input class="checker__control visually-hidden" name="status" value="favorite" type="radio">
          <span class="checker__label">
            Favorites <span class="checker__counter">3</span>
          </span>
        </label>
      </form>
    </div>`
  );
}

export default class CatalogFilterView {
  getTemplate() {
    return createCatalogFilterTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
