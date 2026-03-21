import { render, remove } from '../framework';
import { SortType } from '../constants.js';
import { sortMoviesBy, updateArrayItemById } from '../utils';

import MovieCardPresenter from './movie-card-presenter.js';
import MoviePopupPresenter from './movie-popup-presenter.js';

import CatalogFilterView from '../view/catalog-filter-view.js';
import CatalogListView from '../view/catalog-list-view.js';
import CatalogMessage, { MessageVariant } from '../view/catalog-message-view.js';
import CatalogShowMoreButtonView from '../view/catalog-show-more-button-view.js';
import CatalogSortView from '../view/catalog-sort-view.js';

const MOVIES_COUNT_PER_STEP = 5;

export default class CatalogPresenter {
  #containerElement = null;
  #popupContainerElement = null;
  #model = null;
  #commentsModel = null;
  #sourceMovies = [];
  #movies = [];
  #renderedMoviesCount = 0;

  #sortComponent = null;
  #movieListComponent = null;
  #showMoreButtonComponent = null;

  #sortType = SortType.DEFAULT;
  #movieCardPresenters = new Map();
  #moviePopupPresenter = null;

  constructor({ containerElement, popupContainerElement, model, commentsModel }) {
    this.#containerElement = containerElement;
    this.#popupContainerElement = popupContainerElement;
    this.#model = model;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#sourceMovies = [...this.#model.movies];
    this.#movies = [...this.#model.movies];
    this.#render();
  }

  #renderSort() {
    this.#sortComponent = new CatalogSortView({
      value: this.#sortType,
      onValueChange: this.#sortChangeHandler,
    });

    render(this.#sortComponent, this.#containerElement);
  }

  #renderNextMovies() {
    const renderedMoviesMaxCount = Math.min(
      this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP,
      this.#movies.length
    );

    for (let i = this.#renderedMoviesCount; i < renderedMoviesMaxCount; i++) {
      const movieCardPresenter = new MovieCardPresenter({
        containerElement: this.#movieListComponent.element,
        onLinkClick: (movie) => {
          if (this.#moviePopupPresenter?.movieId === movie.id) {
            return;
          }

          this.#showMoviePopup(movie);
        },
        onDataChange: this.#movieChangeHandler,
      });

      movieCardPresenter.init(this.#movies[i]);
      this.#movieCardPresenters.set(this.#movies[i].id, movieCardPresenter);
    }

    this.#renderedMoviesCount = renderedMoviesMaxCount;
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new CatalogShowMoreButtonView({
      onButtonClick: this.#showMoreButtonClickHandler,
    });

    render(this.#showMoreButtonComponent, this.#containerElement);
  }

  #renderMovieList() {
    this.#movieListComponent = new CatalogListView();
    render(this.#movieListComponent, this.#containerElement);

    this.#renderNextMovies();

    if (this.#movies.length > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  }

  #render() {
    render(new CatalogFilterView(), this.#containerElement);

    if (!this.#movies.length) {
      render(
        new CatalogMessage({ variant: MessageVariant.CatalogEmpty }),
        this.#containerElement,
      );

      return;
    }

    this.#renderSort();
    this.#renderMovieList();
  }

  #destroyMovieList() {
    remove(this.#showMoreButtonComponent);
    this.#showMoreButtonComponent = null;
    remove(this.#movieListComponent);
    this.#movieListComponent = null;
    this.#movieCardPresenters.clear();
    this.#renderedMoviesCount = 0;
  }

  #sortMovies(sortType) {
    if (sortType === SortType.DEFAULT) {
      this.#movies = [...this.#sourceMovies];
    } else {
      sortMoviesBy(this.#movies, sortType);
    }

    this.#sortType = sortType;
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
    this.#sortMovies(value);
    this.#destroyMovieList();
    this.#renderMovieList();
  };

  #movieChangeHandler = (updatedMovie) => {
    updateArrayItemById(this.#sourceMovies, updatedMovie);
    updateArrayItemById(this.#movies, updatedMovie);
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

    if (this.#renderedMoviesCount === this.#movies.length) {
      remove(this.#showMoreButtonComponent);
      this.#showMoreButtonComponent = null;
    }
  };

  #moviePopupCloseHandler = () => {
    this.#moviePopupPresenter = null;
  };
}
