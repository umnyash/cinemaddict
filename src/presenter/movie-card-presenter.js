import { render } from '../framework';
import MovieCardView from '../view/movie-card-view.js';

export default class MovieCardPresenter {
  #containerElement = null;
  #onLinkClick = null;

  #movie = null;
  #cardComponent = null;

  constructor({ containerElement, onLinkClick }) {
    this.#containerElement = containerElement;
    this.#onLinkClick = onLinkClick;
  }

  init(movie) {
    this.#movie = movie;

    this.#cardComponent = new MovieCardView({
      movie: this.#movie,
      onLinkClick: this.#linkClickHandler,
    });

    render(this.#cardComponent, this.#containerElement);
  }

  #linkClickHandler = () => {
    this.#onLinkClick(this.#movie);
  };
}
