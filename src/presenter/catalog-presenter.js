import { render, remove } from '../framework';
import { isEscapeEvent } from '../utils.js';
import CatalogFilterView from '../view/catalog-filter-view.js';
import CatalogListView from '../view/catalog-list-view.js';
import CatalogMessage, { MessageVariant } from '../view/catalog-message-view.js';
import CatalogShowMoreButtonView from '../view/catalog-show-more-button-view.js';
import CatalogSortView from '../view/catalog-sort-view.js';
import MovieCardView from '../view/movie-card-view.js';
import MoviePopupView from '../view/movie-popup-view.js';

const MOVIES_COUNT_PER_STEP = 5;

export default class CatalogPresenter {
  #containerElement = null;
  #popupContainerElement = null;
  #model = null;
  #commentsModel = null;
  #movies = [];
  #renderedMoviesCount = 0;

  #movieListComponent = null;
  #showMoreButtonComponent = null;
  #moviePopupComponent = null;

  constructor({ containerElement, popupContainerElement, model, commentsModel }) {
    this.#containerElement = containerElement;
    this.#popupContainerElement = popupContainerElement;
    this.#model = model;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#movies = this.#model.movies;
    this.#render();
  }

  #renderNextMovies() {
    const renderedMoviesMaxCount = Math.min(
      this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP,
      this.#movies.length
    );

    for (let i = this.#renderedMoviesCount; i < renderedMoviesMaxCount; i++) {
      const movie = this.#movies[i];

      render(
        new MovieCardView({
          movie,
          onLinkClick: () => {
            if (this.#moviePopupComponent) {
              return;
            }

            this.#openMoviePopup(movie);
          },
        }),
        this.#movieListComponent.element,
      );
    }

    this.#renderedMoviesCount = renderedMoviesMaxCount;
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

    render(new CatalogSortView(), this.#containerElement);
    this.#movieListComponent = new CatalogListView();
    render(this.#movieListComponent, this.#containerElement);
    this.#renderNextMovies();

    if (this.#movies.length > this.#renderedMoviesCount) {
      this.#showMoreButtonComponent = new CatalogShowMoreButtonView({
        onButtonClick: this.#showMoreButtonClickHandler,
      });

      render(this.#showMoreButtonComponent, this.#containerElement);
    }
  }

  #openMoviePopup(movie) {
    const comments = this.#commentsModel.get(movie.id, movie.commentsCount);

    this.#moviePopupComponent = new MoviePopupView({
      movie,
      comments,
      onCloseButtonClick: this.#moviePopupCloseButtonClickHandler,
    });

    render(this.#moviePopupComponent, this.#popupContainerElement);

    requestAnimationFrame(() => {
      this.#moviePopupComponent.open();
    });

    document.addEventListener('keydown', this.#documentKeyDownHandler);
  }

  async #closeMoviePopup() {
    document.removeEventListener('keydown', this.#documentKeyDownHandler);
    await this.#moviePopupComponent.close();
    remove(this.#moviePopupComponent);
    this.#moviePopupComponent = null;
  }

  #showMoreButtonClickHandler = () => {
    this.#renderNextMovies();

    if (this.#renderedMoviesCount === this.#movies.length) {
      remove(this.#showMoreButtonComponent);
      this.#showMoreButtonComponent = null;
    }
  };

  #moviePopupCloseButtonClickHandler = () => {
    this.#closeMoviePopup();
  };

  #documentKeyDownHandler = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#closeMoviePopup();
    }
  };
}
