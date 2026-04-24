import { Observable } from '../framework';
import { generateMockMovies } from '../mocks';
import { updateArrayItemById } from '../utils';

const MOVIES_COUNT = 13;

export default class MoviesModel extends Observable {
  #movies = generateMockMovies(MOVIES_COUNT);

  get movies() {
    return this.#movies;
  }

  updateMovie(movieData) {
    updateArrayItemById(this.#movies, movieData);
    this._notify(undefined, movieData);
  }
}
