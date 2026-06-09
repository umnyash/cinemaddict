import { render, remove, RenderPosition } from '../framework';
import { EventType, RequestStatus } from '../constants.js';

import MovieCommentsView from '../view/movie-comments-view.js';
import CommentsHeadingView from '../view/comments-heading-view.js';
import CommentsMessageView, { MessageVariant } from '../view/comments-message-view.js';
import CommentListView from '../view/comment-list-view.js';
import CommentFormView from '../view/comment-form-view.js';

export default class MovieCommentsPresenter {
  #containerElement = null;
  #commentsModel = null;
  #movieId = null;

  #commentsComponent = null;
  #headingComponent = null;
  #messageComponent = null;
  #listComponent = null;
  #formComponent = null;

  constructor({ containerElement, commentsModel, movieId }) {
    this.#containerElement = containerElement;
    this.#commentsModel = commentsModel;
    this.#movieId = movieId;

    this.#commentsModel.addObserver(this.#commentsModelEventHandler);
  }

  get #comments() {
    return this.#commentsModel.comments;
  }

  get #loadingStatus() {
    return this.#commentsModel.loadingStatus;
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

  #renderMessage() {
    this.#messageComponent = new CommentsMessageView({
      variant: this.#loadingStatus === RequestStatus.ERROR
        ? MessageVariant.LOAD_FAILED
        : MessageVariant.LOADING,
    });

    render(this.#messageComponent, this.#commentsComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderCommentList(comments) {
    this.#listComponent = new CommentListView({
      comments,
      onCommentDeleteButtonClick: this.#commentDeleteButtonClickHandler,
    });

    render(this.#listComponent, this.#commentsComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderComments(comments) {
    if (this.#loadingStatus !== RequestStatus.SUCCESS) {
      this.#renderMessage();
    } else if (comments.length) {
      this.#renderCommentList(comments);
    }

    this.#headingComponent = new CommentsHeadingView({
      commentsCount: this.#loadingStatus === RequestStatus.SUCCESS
        ? comments.length
        : null,
    });

    render(this.#headingComponent, this.#commentsComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearComments() {
    remove(this.#headingComponent);
    remove(this.#messageComponent);
    remove(this.#listComponent);
    this.#headingComponent = null;
    this.#messageComponent = null;
    this.#listComponent = null;
  }

  init() {
    this.#commentsModel.init(this.#movieId);
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
