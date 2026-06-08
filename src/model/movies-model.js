import { Observable } from '../framework';
import { EventType } from '../constants.js';

export default class MoviesModel extends Observable {
  #apiService = null;
  #movies = [];

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  getMovieById(id) {
    return this.#movies.find((movie) => movie.id === id) ?? null;
  }

  toggleFavoritedStatus(movieId) {
    const movie = this.#movies.find(({ id }) => id === movieId);
    movie.isFavorited = !movie.isFavorited;
    this._notify(EventType.MOVIE_FAVORITED_TOGGLE, movie);
  }

  toggleWatchedStatus(movieId) {
    const movie = this.#movies.find(({ id }) => id === movieId);
    movie.isWatched = !movie.isWatched;
    this._notify(EventType.MOVIE_WATCHED_TOGGLE, movie);
  }

  toggleWatchlistedStatus(movieId) {
    const movie = this.#movies.find(({ id }) => id === movieId);
    movie.isWatchlisted = !movie.isWatchlisted;
    this._notify(EventType.MOVIE_WATCHLISTED_TOGGLE, movie);
  }

  updateCommentsCount(movieId, count) {
    const movie = this.#movies.find(({ id }) => id === movieId);
    movie.commentsCount = count;
    this._notify(EventType.MOVIE_COMMENTS_UPDATE, movie);
  }

  async init() {
    this.#movies = await this.#apiService.getMovies();
    this._notify(EventType.MOVIES_LOAD);
  }
}
