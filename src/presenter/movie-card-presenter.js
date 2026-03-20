import { render, replace } from '../framework';
import MovieCardView from '../view/movie-card-view.js';

export default class MovieCardPresenter {
  #containerElement = null;
  #onLinkClick = null;
  #onDataChange = null;

  #movie = null;
  #cardComponent = null;

  constructor({ containerElement, onLinkClick, onDataChange }) {
    this.#containerElement = containerElement;
    this.#onLinkClick = onLinkClick;
    this.#onDataChange = onDataChange;
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

  #linkClickHandler = () => {
    this.#onLinkClick(this.#movie);
  };

  #watchlistButtonClickHandler = () => {
    this.#onDataChange({
      ...this.#movie,
      isOnWatchlist: !this.#movie.isOnWatchlist,
    });
  };

  #watchedButtonClickHandler = () => {
    this.#onDataChange({
      ...this.#movie,
      isWatched: !this.#movie.isWatched,
    });
  };

  #favoriteButtonClickHandler = () => {
    this.#onDataChange({
      ...this.#movie,
      isFavorite: !this.#movie.isFavorite,
    });
  };
}
