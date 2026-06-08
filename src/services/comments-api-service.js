import { ApiService } from '../framework';
import { HttpMethod } from './constants.js';

export default class CommentsApiService extends ApiService {
  async getCommentsByMovieId(movieId) {
    const response = await this._load({ url: `comments/${movieId}` });
    const data = await ApiService.parseResponse(response);
    return data.map(this.#adaptToClient);
  }

  async createComment(movieId, commentData) {
    const response = await this._load({
      url: `comments/${movieId}`,
      method: HttpMethod.POST,
      body: JSON.stringify(this.#adaptToServer(commentData)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const data = await ApiService.parseResponse(response);
    return data.comments.map(this.#adaptToClient);
  }

  async deleteComment(commentId) {
    await this._load({
      url: `comments/${commentId}`,
      method: HttpMethod.DELETE,
    });
  }

  #adaptToClient({
    id,
    comment: text,
    emotion: emotionId,
    author: authorName,
    date,
  }) {
    return {
      id,
      text,
      emotionId,
      date,
      author: {
        name: authorName,
      },
    };
  }

  #adaptToServer({
    text: comment,
    emotionId: emotion,
  }) {
    return { comment, emotion };
  }
}
