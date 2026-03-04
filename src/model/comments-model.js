import { generateMockComments } from '../mocks';

export default class CommentsModel {
  #comments = [];

  get(count) {
    this.#comments = generateMockComments(count);
    return this.#comments;
  }
}
