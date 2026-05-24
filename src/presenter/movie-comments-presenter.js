import { render } from '../framework';
import MovieCommentsView from '../view/movie-comments-view.js';

export default class MovieCommentsPresenter {
  #containerElement = null;
  #commentsModel = null;
  #movieId = null;
  #initialCommentsCount = null;

  constructor({ containerElement, commentsModel, movieId, initialCommentsCount }) {
    this.#containerElement = containerElement;
    this.#commentsModel = commentsModel;
    this.#movieId = movieId;
    this.#initialCommentsCount = initialCommentsCount;
  }

  get #comments() {
    return this.#commentsModel.get(this.#movieId, this.#initialCommentsCount);
  }

  #render() {
    const commentsComponent = new MovieCommentsView({
      comments: this.#comments,
      onCommentFormSubmit: this.#commentFormSubmitHandler,
    });

    render(commentsComponent, this.#containerElement);
  }

  init() {
    this.#render();
  }

  #commentFormSubmitHandler = (commentData) => {
    this.#commentsModel.createComment(this.#movieId, commentData);
  };
}
