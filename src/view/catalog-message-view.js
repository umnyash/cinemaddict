import { AbstractView } from '../framework';

const MessageVariant = {
  LOADING: 'loading',
  LOAD_FAILED: 'load failed',
  CATALOG_EMPTY: 'catalog empty',
  WATCHLIST_EMPTY: 'watchlist empty',
  HISTORY_EMPTY: 'history empty',
  FAVORITES_EMPTY: 'favorites empty',
};

const messages = {
  [MessageVariant.LOADING]: 'Loading<span class="animated-ellipsis"><span>...</span></span>',
  [MessageVariant.LOAD_FAILED]: 'We couldn’t load movies. Please try again later',
  [MessageVariant.CATALOG_EMPTY]: 'There are no movies available yet',
  [MessageVariant.WATCHLIST_EMPTY]: 'Your watchlist is empty',
  [MessageVariant.HISTORY_EMPTY]: 'Your history is empty',
  [MessageVariant.FAVORITES_EMPTY]: 'Your favorites is empty',
};

function createCatalogMessageTemplate(variant) {
  return `<p class="catalog__message title title--size_s">${messages[variant]}</p>`;
}

export default class CatalogMessageView extends AbstractView {
  #variant = null;

  constructor({ variant }) {
    super();
    this.#variant = variant;
  }

  _getTemplate() {
    return createCatalogMessageTemplate(this.#variant);
  }
}

export { MessageVariant };
