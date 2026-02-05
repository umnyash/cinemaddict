import { createElement } from '../framework';

function createMoviesCountTemplate() {
  return '<p class="site-footer__movies-count">130 291 movies inside</p>';
}

export default class MoviesCountView {
  getTemplate() {
    return createMoviesCountTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
