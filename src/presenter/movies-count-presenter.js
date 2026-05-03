import { render } from '../framework';
import MoviesCountView from '../view/movies-count-view.js';

export default class MoviesCountPresenter {
  #containerElement = null;
  #moviesModel = null;

  constructor({ containerElement, moviesModel }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
  }

  init() {
    const moviesCountComponent = new MoviesCountView({
      count: this.#moviesModel.movies.length
    });

    render(moviesCountComponent, this.#containerElement);
  }
}
