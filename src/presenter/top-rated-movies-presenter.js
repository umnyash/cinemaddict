import { render } from '../framework';
import { getTopMovies } from '../utils';
import MovieCardPresenter from './movie-card-presenter.js';
import MovieListView from '../view/movie-list-view.js';
import TopRatedMoviesView from '../view/top-rated-movies-view.js';

const TOP_MOVIES_LIMIT = 2;

export default class TopRatedMoviesPresenter {
  #containerElement = null;
  #moviesModel = null;
  #moviePopupPresenter = null;

  #movies = [];
  #movieCardPresenters = new Map();

  constructor({ containerElement, moviesModel, moviePopupPresenter }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;
    this.#moviePopupPresenter = moviePopupPresenter;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  init() {
    this.#movies = getTopMovies(this.#moviesModel.movies, ({ rating }) => rating, TOP_MOVIES_LIMIT);

    if (this.#movies.length) {
      this.#render();
    }
  }

  #renderMovieCard(movie, containerElement) {
    const movieCardPresenter = new MovieCardPresenter({
      containerElement: containerElement.element,
      onLinkClick: this.#movieCardLinkClickHandler,
      onDataChange: this.#movieChangeHandler,
    });

    movieCardPresenter.init(movie);
    this.#movieCardPresenters.set(movie.id, movieCardPresenter);
  }

  #render() {
    const sectionComponent = new TopRatedMoviesView();
    const movieListComponent = new MovieListView();

    this.#movies.forEach((movie) => {
      this.#renderMovieCard(movie, movieListComponent);
    });

    render(movieListComponent, sectionComponent.element);
    render(sectionComponent, this.#containerElement);
  }

  #movieChangeHandler = (updatedMovie) => {
    this.#moviesModel.updateMovie(updatedMovie);
  };

  #movieCardLinkClickHandler = (movieId) => {
    this.#moviePopupPresenter.show(movieId);
  };

  #moviesModelEventHandler = (_event, data) => {
    this.#movieCardPresenters.get(data.id)?.init(data);
  };
}
