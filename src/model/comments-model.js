import { Observable } from '../framework';
import { EventType, RequestStatus } from '../constants.js';

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

  async createComment(movieId, commentData) {
    try {
      const comments = await this.#apiService.createComment(movieId, commentData);

      if (this.#movieId === movieId) {
        this.#loadingStatus = RequestStatus.SUCCESS;
        this.#comments = comments;
      }

      this._notify(EventType.COMMENT_CREATE, { movieId, comments });
    } catch {
      throw new Error('Can\'t create comment');
    }
  }

  async deleteComment(movieId, commentId) {
    const commentIndex = this.#comments.findIndex(({ id }) => id === commentId);

    if (commentIndex === -1) {
      throw new Error(`Can't delete unexisting event (id: ${commentId})`);
    }

    try {
      const comments = [...this.#comments];
      await this.#apiService.deleteComment(commentId);
      comments.splice(commentIndex, 1);

      if (this.#movieId === movieId) {
        this.#comments = comments;
      }

      this._notify(EventType.COMMENT_DELETE, { movieId, comments });
    } catch {
      throw new Error(`Can't delete comment (id: ${commentId})`);
    }
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
