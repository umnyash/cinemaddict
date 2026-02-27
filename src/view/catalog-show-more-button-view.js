import { AbstractView } from '../framework';

function createCatalogShowMoreButtonTemplate() {
  return (
    `<button class="catalog__show-more-button button button--secondary button--size_m">
      Show more
    </button>`
  );
}

export default class CatalogShowMoreButtonView extends AbstractView {
  #onButtonClick = null;

  constructor({ onButtonClick }) {
    super();
    this.#onButtonClick = onButtonClick;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  _getTemplate() {
    return createCatalogShowMoreButtonTemplate();
  }

  #buttonClickHandler = () => {
    this.#onButtonClick();
  };
}
