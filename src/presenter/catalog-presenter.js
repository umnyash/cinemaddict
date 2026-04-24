import { render, remove } from '../framework';
import { MovieStatus } from '../constants.js';
import { filterMovies, sortMoviesBy } from '../utils';

import MovieCardPresenter from './movie-card-presenter.js';
import MoviePopupPresenter from './movie-popup-presenter.js';

import CatalogListView from '../view/catalog-list-view.js';
import CatalogMessage, { MessageVariant } from '../view/catalog-message-view.js';
import CatalogShowMoreButtonView from '../view/catalog-show-more-button-view.js';
import CatalogSortView from '../view/catalog-sort-view.js';

const MOVIES_COUNT_PER_STEP = 5;

export default class CatalogPresenter {
  #containerElement = null;
  #popupContainerElement = null;
  #moviesModel = null;
  #filterModel = null;
  #commentsModel = null;
  #renderedMoviesCount = 0;

  #messageComponent = null;
  #sortComponent = null;
  #movieListComponent = null;
  #showMoreButtonComponent = null;

  #sortType = null;
  #movieCardPresenters = new Map();
  #moviePopupPresenter = null;

  constructor({ containerElement, popupContainerElement, moviesModel, filterModel, commentsModel }) {
    this.#containerElement = containerElement;
    this.#popupContainerElement = popupContainerElement;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#filterModel.addObserver(this.#filterModelEventHandler);
  }

  get #filter() {
    return this.#filterModel.filter;
  }

  get #movies() {
    const filteredMovies = filterMovies(this.#moviesModel.movies, this.#filter);

    return this.#sortType
      ? sortMoviesBy(filteredMovies, this.#sortType)
      : filteredMovies;
  }

  init() {
    this.#render();
  }

  #renderMessage() {
    let messageVariant;

    switch (this.#filter.status) {
      case MovieStatus.WATCHLISTED:
        messageVariant = MessageVariant.WatchlistEmpty;
        break;
      case MovieStatus.WATCHED:
        messageVariant = MessageVariant.HistoryEmpty;
        break;
      case MovieStatus.FAVORITED:
        messageVariant = MessageVariant.FavoritesEmpty;
        break;
      default:
        messageVariant = MessageVariant.CatalogEmpty;
    }

    this.#messageComponent = new CatalogMessage({ variant: messageVariant });
    render(this.#messageComponent, this.#containerElement);
  }

  #renderSort() {
    this.#sortComponent = new CatalogSortView({
      value: this.#sortType,
      onValueChange: this.#sortChangeHandler,
    });

    render(this.#sortComponent, this.#containerElement);
  }

  #renderMovieCard(movie) {
    const movieCardPresenter = new MovieCardPresenter({
      containerElement: this.#movieListComponent.element,
      onLinkClick: this.#movieCardLinkClickHandler,
      onDataChange: this.#movieChangeHandler,
    });

    movieCardPresenter.init(movie);
    this.#movieCardPresenters.set(movie.id, movieCardPresenter);
  }

  #renderMovieCards({ isNext } = {}) {
    const from = isNext ? this.#renderedMoviesCount : 0;

    const count = isNext
      ? MOVIES_COUNT_PER_STEP
      : Math.max(this.#renderedMoviesCount, MOVIES_COUNT_PER_STEP);

    const renderedMoviesMaxCount = Math.min(from + count, this.#movies.length);

    for (let i = from; i < renderedMoviesMaxCount; i++) {
      this.#renderMovieCard(this.#movies[i]);
    }

    this.#renderedMoviesCount = renderedMoviesMaxCount;
  }

  #renderMovieList() {
    this.#movieListComponent = new CatalogListView();
    render(this.#movieListComponent, this.#containerElement);
    this.#renderMovieCards();
  }

  #renderMovies() {
    this.#renderMovieList();

    if (this.#movies.length > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  }

  #renderNextMovies() {
    this.#renderMovieCards({ isNext: true });

    if (this.#renderedMoviesCount === this.#movies.length) {
      this.#destroyShowMoreButton();
    }
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new CatalogShowMoreButtonView({
      onButtonClick: this.#showMoreButtonClickHandler,
    });

    render(this.#showMoreButtonComponent, this.#containerElement);
  }

  #render() {
    if (!this.#movies.length) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    this.#renderMovies();
  }

  #destroyMessage() {
    remove(this.#messageComponent);
    this.#messageComponent = null;
  }

  #destroySort() {
    remove(this.#sortComponent);
    this.#sortComponent = null;
  }

  #destroyShowMoreButton() {
    remove(this.#showMoreButtonComponent);
    this.#showMoreButtonComponent = null;
  }

  #destroyMovieList() {
    remove(this.#movieListComponent);
    this.#movieListComponent = null;
    this.#movieCardPresenters.clear();
  }

  #clearMovies() {
    this.#destroyShowMoreButton();
    this.#destroyMovieList();
  }

  #clear() {
    this.#destroyMessage();
    this.#clearMovies();
    this.#destroySort();
  }

  #showMoviePopup(movie) {
    const comments = this.#commentsModel.get(movie.id, movie.commentsCount);

    if (this.#moviePopupPresenter) {
      this.#moviePopupPresenter.init({ movie, comments });
      return;
    }

    this.#moviePopupPresenter = new MoviePopupPresenter({
      containerElement: this.#popupContainerElement,
      onPopupClose: this.#moviePopupCloseHandler,
      onDataChange: this.#movieChangeHandler,
    });

    this.#moviePopupPresenter.init({ movie, comments });
    this.#moviePopupPresenter.open();
  }

  #sortChangeHandler = (value) => {
    this.#sortType = value;
    this.#renderedMoviesCount = 0;
    this.#clearMovies();
    this.#renderMovies();
  };

  #movieChangeHandler = (updatedMovie) => {
    this.#moviesModel.updateMovie(updatedMovie);
    this.#movieCardPresenters.get(updatedMovie.id)?.init(updatedMovie);

    if (this.#moviePopupPresenter?.movieId !== updatedMovie.id) {
      return;
    }

    const comments = this.#commentsModel.get(updatedMovie.id, updatedMovie.commentsCount);

    this.#moviePopupPresenter.init({
      movie: updatedMovie,
      comments,
    });
  };

  #showMoreButtonClickHandler = () => {
    this.#renderNextMovies();
  };

  #movieCardLinkClickHandler = (movie) => {
    if (this.#moviePopupPresenter?.movieId === movie.id) {
      return;
    }

    this.#showMoviePopup(movie);
  };

  #moviePopupCloseHandler = () => {
    this.#moviePopupPresenter = null;
  };

  #filterModelEventHandler = () => {
    this.#clear();
    this.#sortType = null;
    this.#renderedMoviesCount = 0;
    this.#render();
  };
}
