import { AbstractView } from '../framework';

function createMoviesCountTemplate() {
  return '<p class="site-footer__movies-count">130 291 movies inside</p>';
}

export default class MoviesCountView extends AbstractView {
  _getTemplate() {
    return createMoviesCountTemplate();
  }
}
