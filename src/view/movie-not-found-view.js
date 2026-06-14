import { AbstractView } from '../framework';

function createMovieNotFoundTemplate() {
  return (
    `<article class="popup__movie movie">
      <h2 class="movie__title title title--size_m">Movie not found</h2>
      <p class="movie__description">This movie might have been removed or never existed</p>
    </article>`
  );
}

export default class MovieNotFoundView extends AbstractView {
  _getTemplate() {
    return createMovieNotFoundTemplate();
  }
}
