import { AbstractView } from '../framework';

function createMostCommentedMoviesTemplate() {
  return (
    `<section class="movies">
      <h3 class="movies__title title title--size_s">Most commented</h3>
    </section>`
  );
}

export default class MostCommentedMoviesView extends AbstractView {
  _getTemplate() {
    return createMostCommentedMoviesTemplate();
  }
}
