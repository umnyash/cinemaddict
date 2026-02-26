import { AbstractView } from '../framework';

function createCatalogListTemplate() {
  return '<ul class="catalog__list movies-list"></ul>';
}

export default class CatalogListView extends AbstractView {
  _getTemplate() {
    return createCatalogListTemplate();
  }
}
