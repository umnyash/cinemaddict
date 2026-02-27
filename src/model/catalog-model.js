import { generateMockMovies } from '../mocks';

const MOVIES_COUNT = 13;

export default class CatalogModel {
  #movies = generateMockMovies(MOVIES_COUNT);

  get movies() {
    return this.#movies;
  }
}
