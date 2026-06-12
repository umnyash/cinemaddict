import { render, remove, RenderPosition } from '../framework';
import { EventType, RequestStatus } from '../constants.js';

import MovieCommentsView from '../view/movie-comments-view.js';
import CommentsHeadingView from '../view/comments-heading-view.js';
import CommentsMessageView, { MessageVariant } from '../view/comments-message-view.js';
import CommentListView from '../view/comment-list-view.js';
import CommentView from '../view/comment-view.js';
import CommentFormView from '../view/comment-form-view.js';

export default class MovieCommentsPresenter {
  #containerElement = null;
  #commentsModel = null;
  #movieId = null;
  #uiBlocker = null;

  #commentsComponent = null;
  #headingComponent = null;
  #messageComponent = null;
  #listComponent = null;
  #commentComponents = new Map();
  #formComponent = null;

  constructor({ containerElement, commentsModel, movieId, uiBlocker }) {
    this.#containerElement = containerElement;
    this.#commentsModel = commentsModel;
    this.#movieId = movieId;
    this.#uiBlocker = uiBlocker;

    this.#commentsModel.addObserver(this.#commentsModelEventHandler);
  }

  get #comments() {
    return this.#commentsModel.comments;
  }

  get #loadingStatus() {
    return this.#commentsModel.loadingStatus;
  }

  init() {
    this.#commentsModel.init(this.#movieId);
    this.#render();
  }

  destroy() {
    this.#commentsModel.removeObserver(this.#commentsModelEventHandler);
    remove(this.#commentsComponent);
    this.#commentsComponent = null;
    this.#headingComponent = null;
    this.#messageComponent = null;
    this.#listComponent = null;
    this.#formComponent = null;
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
    this.#listComponent = new CommentListView();

    comments.forEach((comment) => {
      const commentComponent = new CommentView({
        comment,
        onDeleteButtonClick: this.#commentDeleteButtonClickHandler,
      });

      this.#commentComponents.set(comment.id, commentComponent);
      render(commentComponent, this.#listComponent.element);
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
    this.#commentComponents.clear();
    this.#headingComponent = null;
    this.#messageComponent = null;
    this.#listComponent = null;
  }

  #commentDeleteButtonClickHandler = async (commentId) => {
    this.#uiBlocker.block();

    try {
      await this.#commentsModel.deleteComment(this.#movieId, commentId);
    } catch {
      this.#commentComponents.get(commentId).shake();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #commentFormSubmitHandler = async (commentData) => {
    this.#uiBlocker.block();

    try {
      this.#formComponent.disable();
      await this.#commentsModel.createComment(this.#movieId, commentData);
    } catch {
      this.#formComponent.shake(() => {
        this.#formComponent.enable();
      });
    } finally {
      this.#uiBlocker.unblock();
    }
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
