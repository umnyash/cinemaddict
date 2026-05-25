import { Observable } from '../framework';
import { EventType } from '../constants.js';
import { generateMockComments } from '../mocks';
import { deleteArrayItemById } from '../utils';

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

    this.#comments.get(movieId).push(newComment);

    this._notify(EventType.COMMENT_CREATE, {
      movieId,
      comments: this.#comments.get(movieId),
    });
  }

  deleteComment(movieId, commentId) {
    deleteArrayItemById(this.#comments.get(movieId), commentId);

    this._notify(EventType.COMMENT_DELETE, {
      movieId,
      comments: this.#comments.get(movieId),
    });
  }
}
