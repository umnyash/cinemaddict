import { generateMockComments } from '../mocks';

export default class CommentsModel {
  #comments = new Map();

  get(movieId, count) {
    if (!this.#comments.has(movieId)) {
      this.#comments.set(movieId, generateMockComments(count));
    }

    return this.#comments.get(movieId);
  }
}
