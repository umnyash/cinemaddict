import { generateMockMovies } from '../mocks';

const MOVIES_COUNT = 5;

export default class CatalogModel {
  movies = generateMockMovies(MOVIES_COUNT);

  getMovies() {
    return this.movies;
  }
}
