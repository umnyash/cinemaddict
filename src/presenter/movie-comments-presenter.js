import { render } from '../framework';

import MovieCommentsView from '../view/movie-comments-view.js';
import CommentsHeadingView from '../view/comments-heading-view.js';
import CommentListView from '../view/comment-list-view.js';
import CommentFormView from '../view/comment-form-view.js';

export default class MovieCommentsPresenter {
  #containerElement = null;
  #commentsModel = null;
  #movieId = null;
  #initialCommentsCount = null;

  #headingComponent = null;
  #listComponent = null;
  #formComponent = null;

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
    const commentsComponent = new MovieCommentsView();
    this.#headingComponent = new CommentsHeadingView({ commentsCount: this.#comments.length });

    this.#formComponent = new CommentFormView({
      onCommentFormSubmit: this.#commentFormSubmitHandler,
    });

    render(this.#headingComponent, commentsComponent.element);

    if (this.#comments.length) {
      this.#listComponent = new CommentListView({ comments: this.#comments });
      render(this.#listComponent, commentsComponent.element);
    }

    render(this.#formComponent, commentsComponent.element);
    render(commentsComponent, this.#containerElement);
  }

  init() {
    this.#render();
  }

  #commentFormSubmitHandler = (commentData) => {
    this.#commentsModel.createComment(this.#movieId, commentData);
  };
}
