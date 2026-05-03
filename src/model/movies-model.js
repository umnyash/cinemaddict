import { Observable } from '../framework';
import { generateMockMovies } from '../mocks';
import { updateArrayItemById } from '../utils';

const MOVIES_COUNT = 13;

export default class MoviesModel extends Observable {
  #movies = generateMockMovies(MOVIES_COUNT);

  get movies() {
    return this.#movies;
  }

  getMovieById(id) {
    return this.#movies.find((movie) => movie.id === id) ?? null;
  }

  updateMovie(eventType, movieData) {
    updateArrayItemById(this.#movies, movieData);
    this._notify(eventType, movieData);
  }
}
