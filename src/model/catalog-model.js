import { MOVIES_PER_LOAD } from '../const';
import { generateMockMovies } from '../mocks';

export default class CatalogModel {
  movies = generateMockMovies(MOVIES_PER_LOAD);

  getMovies() {
    return this.movies;
  }
}
