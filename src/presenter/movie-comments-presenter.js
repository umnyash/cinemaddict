import { render, remove, RenderPosition } from '../framework';
import { EventType } from '../constants.js';

import MovieCommentsView from '../view/movie-comments-view.js';
import CommentsHeadingView from '../view/comments-heading-view.js';
import CommentListView from '../view/comment-list-view.js';
import CommentFormView from '../view/comment-form-view.js';

export default class MovieCommentsPresenter {
  #containerElement = null;
  #commentsModel = null;
  #movieId = null;
  #initialCommentsCount = null;

  #commentsComponent = null;
  #headingComponent = null;
  #listComponent = null;
  #formComponent = null;

  constructor({ containerElement, commentsModel, movieId, initialCommentsCount }) {
    this.#containerElement = containerElement;
    this.#commentsModel = commentsModel;
    this.#movieId = movieId;
    this.#initialCommentsCount = initialCommentsCount;

    this.#commentsModel.addObserver(this.#commentsModelEventHandler);
  }

  get #comments() {
    return this.#commentsModel.get(this.#movieId, this.#initialCommentsCount);
  }

  #render() {
    this.#commentsComponent = new MovieCommentsView();

    this.#formComponent = new CommentFormView({
      onCommentFormSubmit: this.#commentFormSubmitHandler
    });

    this.#renderComments(this.#comments);
    render(this.#formComponent, this.#commentsComponent.element);
    render(this.#commentsComponent, this.#containerElement);
  }

  #renderComments(comments) {
    if (comments.length) {
      this.#listComponent = new CommentListView({
        comments,
        onCommentDeleteButtonClick: this.#commentDeleteButtonClickHandler,
      });

      render(this.#listComponent, this.#commentsComponent.element, RenderPosition.AFTERBEGIN);
    }

    this.#headingComponent = new CommentsHeadingView({ commentsCount: comments.length });
    render(this.#headingComponent, this.#commentsComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearComments() {
    remove(this.#headingComponent);
    remove(this.#listComponent);
    this.#headingComponent = null;
    this.#listComponent = null;
  }

  init() {
    this.#render();
  }

  #commentDeleteButtonClickHandler = (commentId) => {
    this.#commentsModel.deleteComment(this.#movieId, commentId);
  };

  #commentFormSubmitHandler = (commentData) => {
    this.#commentsModel.createComment(this.#movieId, commentData);
  };

  #commentsModelEventHandler = (eventType, { movieId, comments }) => {
    if (this.#movieId !== movieId) {
      return;
    }

    if (eventType === EventType.COMMENT_CREATE) {
      this.#formComponent.reset();
    }

    this.#clearComments();
    this.#renderComments(comments);
  };
}
