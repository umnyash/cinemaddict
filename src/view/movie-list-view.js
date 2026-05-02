import { AbstractView } from '../framework';

function createMovieListTemplate() {
  return '<ul class="movies__list movies-list"></ul>';
}

export default class MovieListView extends AbstractView {
  _getTemplate() {
    return createMovieListTemplate();
  }
}
