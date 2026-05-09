import { AbstractView } from '../framework';

function createPopupInnerTemplate() {
  return (
    `<div class="popup__inner">
      <button class="popup__close-button">
        <span class="visually-hidden">Close</span>
      </button>
    </div>`
  );
}

export default class PopupInnerView extends AbstractView {
  #onCloseButtonClick = null;

  constructor({ onCloseButtonClick }) {
    super();
    this.#onCloseButtonClick = onCloseButtonClick;
    this.element.querySelector('.popup__close-button')
      .addEventListener('click', this.#closeButtonClickHandler, { once: true });
  }

  _getTemplate() {
    return createPopupInnerTemplate();
  }

  #closeButtonClickHandler = () => {
    this.#onCloseButtonClick();
  };
}
