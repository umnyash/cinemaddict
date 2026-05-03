import { AbstractView } from '../framework';
import { getDeclension } from '../utils';

function createMoviesCountTemplate(count) {
  const label = `${getDeclension(count, { one: 'movie', many: 'movies' })} inside`;

  return `<p class="site-footer__movies-count">${count} ${label}</p>`;
}

export default class MoviesCountView extends AbstractView {
  #count = null;

  constructor({ count }) {
    super();
    this.#count = count;
  }

  _getTemplate() {
    return createMoviesCountTemplate(this.#count);
  }
}
