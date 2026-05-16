import { Observable } from '../framework';
import { EventType } from '../constants.js';
import { generateMockComments } from '../mocks';

const mockAuthor = {
  name: 'Rusik',
};

export default class CommentsModel extends Observable {
  #comments = new Map();

  get(movieId, count) {
    if (!this.#comments.has(movieId)) {
      this.#comments.set(movieId, generateMockComments(count));
    }

    return this.#comments.get(movieId);
  }

  createComment(movieId, commentData) {
    const newComment = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      author: mockAuthor,
      ...commentData,
    };

    if (this.#comments.has(movieId)) {
      this.#comments.get(movieId).push(newComment);
    }

    this._notify(EventType.COMMENT_CREATE, movieId);
  }
}
