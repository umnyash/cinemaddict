import { Observable } from '../framework';
import { EventType, MovieStatus, RequestStatus } from '../constants.js';

const movieStatusMap = {
  [MovieStatus.WATCHLISTED]: {
    property: 'isWatchlisted',
    eventType: EventType.MOVIE_WATCHLISTED_TOGGLE,
  },
  [MovieStatus.WATCHED]: {
    property: 'isWatched',
    eventType: EventType.MOVIE_WATCHED_TOGGLE,
  },
  [MovieStatus.FAVORITED]: {
    property: 'isFavorited',
    eventType: EventType.MOVIE_FAVORITED_TOGGLE,
  },
};

export default class MoviesModel extends Observable {
  #apiService = null;
  #movies = [];
  #loadingStatus = RequestStatus.PENDING;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  get loadingStatus() {
    return this.#loadingStatus;
  }

  getMovieById(id) {
    return this.#movies.find((movie) => movie.id === id) ?? null;
  }

  async toggleFavoritedStatus(movieId) {
    await this.#toggleStatus(movieId, MovieStatus.FAVORITED);
  }

  async toggleWatchedStatus(movieId) {
    await this.#toggleStatus(movieId, MovieStatus.WATCHED);
  }

  async toggleWatchlistedStatus(movieId) {
    await this.#toggleStatus(movieId, MovieStatus.WATCHLISTED);
  }

  updateCommentsCount(movieId, count) {
    const movie = this.#movies.find(({ id }) => id === movieId);
    movie.commentsCount = count;
    this._notify(EventType.MOVIE_COMMENTS_UPDATE, movie);
  }

  async init() {
    try {
      this.#movies = await this.#apiService.getMovies();
      this.#loadingStatus = RequestStatus.SUCCESS;
    } catch {
      this.#loadingStatus = RequestStatus.ERROR;
    }

    this._notify(EventType.MOVIES_LOAD);
  }

  async #toggleStatus(movieId, status) {
    const movieIndex = this.#movies.findIndex(({ id }) => id === movieId);

    if (movieIndex === -1) {
      throw new Error(`Can't toggle ${status} status of non-existent movie (id: ${movieId})`);
    }

    const movie = this.#movies[movieIndex];
    const { property, eventType } = movieStatusMap[status];

    try {
      const updatedMovie = await this.#apiService.updateMovie({
        ...movie,
        [property]: !movie[property],
      });

      this.#movies[movieIndex] = updatedMovie;
      this._notify(eventType, updatedMovie);
    } catch {
      throw new Error(`Failed to toggle movie ${status} status (id: ${movieId})`);
    }
  }
}
