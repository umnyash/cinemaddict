import { createElement } from '../framework';

function createMoviesCountTemplate() {
  return '<p class="site-footer__movies-count">130 291 movies inside</p>';
}

export default class MoviesCountView {
  #element = null;

  _getTemplate() {
    return createMoviesCountTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this._getTemplate());
    }

    return this.#element;
  }

  getElement() {
    return this.element;
  }
}
