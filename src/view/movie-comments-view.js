import { AbstractView } from '../framework';

function createMovieCommentsTemplate() {
  return '<section class="movie__comments comments"></section>';
}

export default class MovieCommentsView extends AbstractView {
  _getTemplate() {
    return createMovieCommentsTemplate();
  }
}
