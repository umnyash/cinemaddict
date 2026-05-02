import { AbstractView } from '../framework';

function createTopRatedMoviesTemplate() {
  return (
    `<section class="movies">
      <h3 class="movies__title title title--size_s">Top rated</h3>
    </section>`
  );
}

export default class TopRatedMoviesView extends AbstractView {
  _getTemplate() {
    return createTopRatedMoviesTemplate();
  }
}
