import { render, replace } from '../framework';
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

    const newCardComponent = new MovieCardView({
      movie: this.#movie,
      onLinkClick: this.#linkClickHandler,
    });

    if (this.#cardComponent) {
      replace(newCardComponent, this.#cardComponent);
    } else {
      render(newCardComponent, this.#containerElement);
    }

    this.#cardComponent = newCardComponent;
  }

  #linkClickHandler = () => {
    this.#onLinkClick(this.#movie);
  };
}
