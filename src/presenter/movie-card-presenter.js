import { render, replace } from '../framework';
import MovieCardView from '../view/movie-card-view.js';

export default class MovieCardPresenter {
  #containerElement = null;
  #onLinkClick = null;
  #onWatchlistButtonClick = null;
  #onWatchedButtonClick = null;
  #onFavoriteButtonClick = null;

  #movie = null;
  #cardComponent = null;

  constructor({
    containerElement,
    onLinkClick,
    onWatchlistButtonClick,
    onWatchedButtonClick,
    onFavoriteButtonClick,
  }) {
    this.#containerElement = containerElement;
    this.#onLinkClick = onLinkClick;
    this.onWatchlistButtonClick = onWatchlistButtonClick;
    this.onWatchedButtonClick = onWatchedButtonClick;
    this.onFavoriteButtonClick = onFavoriteButtonClick;
  }

  init(movie) {
    this.#movie = movie;

    const newCardComponent = new MovieCardView({
      movie: this.#movie,
      onLinkClick: this.#linkClickHandler,
      onWatchlistButtonClick: this.#watchlistButtonClickHandler,
      onWatchedButtonClick: this.#watchedButtonClickHandler,
      onFavoriteButtonClick: this.#favoriteButtonClickHandler,
    });

    if (this.#cardComponent) {
      replace(newCardComponent, this.#cardComponent);
    } else {
      render(newCardComponent, this.#containerElement);
    }

    this.#cardComponent = newCardComponent;
  }

  setFailed() {
    this.#cardComponent.shake();
  }

  #linkClickHandler = () => {
    this.#onLinkClick(this.#movie.id);
  };

  #watchlistButtonClickHandler = () => {
    this.onWatchlistButtonClick(this.#movie.id);
  };

  #watchedButtonClickHandler = () => {
    this.onWatchedButtonClick(this.#movie.id);
  };

  #favoriteButtonClickHandler = () => {
    this.onFavoriteButtonClick(this.#movie.id);
  };
}
