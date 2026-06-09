import { Observable } from '../framework';
import { EventType, RequestStatus } from '../constants.js';
import { deleteArrayItemById } from '../utils';

const mockAuthor = {
  name: 'Rusik',
};

export default class CommentsModel extends Observable {
  #apiService = null;
  #comments = [];
  #movieId = null;
  #loadingStatus = null;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  get loadingStatus() {
    return this.#loadingStatus;
  }

  createComment(movieId, commentData) {
    const newComment = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      author: mockAuthor,
      ...commentData,
    };

    this.#comments.push(newComment);

    this._notify(EventType.COMMENT_CREATE, {
      movieId,
      comments: this.#comments,
    });
  }

  deleteComment(movieId, commentId) {
    deleteArrayItemById(this.#comments, commentId);

    this._notify(EventType.COMMENT_DELETE, {
      movieId,
      comments: this.#comments,
    });
  }

  async init(movieId) {
    this.#loadingStatus = RequestStatus.PENDING;
    this.#comments = [];
    this.#movieId = movieId;

    try {
      this.#comments = await this.#apiService.getCommentsByMovieId(movieId);
      this.#loadingStatus = RequestStatus.SUCCESS;
    } catch {
      this.#loadingStatus = RequestStatus.ERROR;
    }

    this._notify(EventType.COMMENTS_LOAD, {
      movieId,
      comments: this.#comments,
    });
  }
}
