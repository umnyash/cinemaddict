import { render } from '../framework';
import MoviesCountView from '../view/movies-count-view.js';

export default class MoviesCountPresenter {
  #containerElement = null;

  constructor({ containerElement }) {
    this.#containerElement = containerElement;
  }

  init() {
    render(new MoviesCountView(), this.#containerElement);
  }
}
