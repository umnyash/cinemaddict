import { AbstractView } from '../framework';

const MessageVariant = {
  Loading: 'Loading',
  LoadFailed: 'LoadFailed',
  CatalogEmpty: 'CatalogEmpty',
  WatchlistEmpty: 'WatchlistEmpty',
  HistoryEmpty: 'HistoryEmpty',
  FavoritesEmpty: 'FavoritesEmpty',
};

const messages = {
  [MessageVariant.Loading]: 'Loading<span class="animated-ellipsis"><span>...</span></span>',
  [MessageVariant.LoadFailed]: 'We couldn’t load movies. Please try again later',
  [MessageVariant.CatalogEmpty]: 'There are no movies available yet',
  [MessageVariant.WatchlistEmpty]: 'Your watchlist is empty',
  [MessageVariant.HistoryEmpty]: 'You haven’t watched any movies yet',
  [MessageVariant.FavoritesEmpty]: 'You don’t have any favorite movies yet',
};

function createCatalogMessageTemplate(variant) {
  return `<p class="catalog__message title title--size_s">${messages[variant]}</p>`;
}

export default class CatalogMessage extends AbstractView {
  #variant = null;

  constructor({ variant }) {
    super();
    this.#variant = variant;
  }

  get template() {
    return createCatalogMessageTemplate(this.#variant);
  }
}

export { MessageVariant };
