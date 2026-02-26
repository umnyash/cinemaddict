import { AbstractView } from '../framework';

function createCatalogShowMoreButtonTemplate() {
  return (
    `<button class="catalog__show-more-button button button--secondary button--size_m">
      Show more
    </button>`
  );
}

export default class CatalogShowMoreButtonView extends AbstractView {
  _getTemplate() {
    return createCatalogShowMoreButtonTemplate();
  }
}
