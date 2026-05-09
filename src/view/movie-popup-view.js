import { AbstractView } from '../framework';

function createMoviePopupTemplate() {
  return '<dialog class="popup popup--position_right"></dialog>';
}

export default class MoviePopupView extends AbstractView {
  constructor({ isOpen }) {
    super();

    if (isOpen) {
      this.open();
    }
  }

  _getTemplate() {
    return createMoviePopupTemplate();
  }

  open() {
    this.element.show();
  }

  close() {
    return new Promise((resolve) => {
      const popupTransitionEndHandler = (evt) => {
        if (evt.target === this.element && evt.propertyName === 'visibility') {
          this.element.removeEventListener('transitionend', popupTransitionEndHandler);
          resolve();
        }
      };

      this.element.addEventListener('transitionend', popupTransitionEndHandler);
      this.element.close();
    });
  }
}
