import { AbstractStatefulView } from '../framework';
import { emotions, emotionIds } from '../data';
import { escapeHtml, formatCommentDate, isEnterEvent } from '../utils';

const CommentFormFieldName = {
  EMOTION: 'emotion',
  TEXT: 'text',
};

function createMovieCommentsListItemTemplate(comment) {
  const { text, emotionId, date, author: { name } } = comment;
  const formattedDate = formatCommentDate(date);
  const escapedText = escapeHtml(text);

  return (
    `<li class="comment">
      <img
        class="comment__emotion"
        src="${emotions[emotionId].iconUrl}"
        width="55"
        height="55"
        alt="${emotions[emotionId].name} emoji."
        loading="lazy"
      >
      <blockquote class="comment__text">${escapedText}</blockquote>
      <p class="comment__author">${name}</p>
      <time class="comment__date" datetime="${date}">${formattedDate}</time>
      <button class="comment__delete-button link" type="button">Delete</button>
    </li>`
  );
}

function createMovieCommentsListTemplate(comments) {
  if (!comments.length) {
    return '';
  }

  return (
    `<ul class="comments__list comment-list">
      ${comments.map(createMovieCommentsListItemTemplate).join('')}
    </ul>`
  );
}

function createMovieCommentsFormTemplate(currentEmotionId, text) {
  return (
    `<form class="comment-form" action="https://echo.htmlacademy.ru/courses" method="post">
      <div class="comment-form__emotion-wrapper" aria-hidden="true">
        ${currentEmotionId ? `<img class="comment-form__emotion" src="${emotions[currentEmotionId].iconUrl}" width="55" height="55" alt="">` : ''}
      </div>
      <label class="comment-form__field text-area">
        <textarea class="text-area__control" name="${CommentFormFieldName.TEXT}" rows="1" placeholder="Good movie!" required>${text}</textarea>
        <span class="text-area__label">Select reaction below and write comment here</span>
      </label>
      <fieldset class="comment-form__emotions">
        <legend class="visually-hidden">Emotion:</legend>
        ${emotionIds.map((id) => `
          <label class="checker checker--icon">
            <input
              class="checker__control visually-hidden"
              name="${CommentFormFieldName.EMOTION}"
              value="${id}"
              type="radio"
              required
              ${id === currentEmotionId ? 'checked' : ''}
            >
            <img
              class="checker__label"
              src="${emotions[id].iconUrl}"
              width="30"
              height="30"
              alt="${emotions[id].name} emoji."
            >
          </label>
        `).join('')}
      </fieldset>
    </form>`
  );
}

function createMovieCommentsTemplate({ comments, state }) {
  const {
    newCommentEmotionId,
    newCommentText,
  } = state;

  return (
    `<section class="movie__comments comments">
      <h3 class="comments__title title title--size_m">Comments ${comments.length}</h3>
      ${createMovieCommentsListTemplate(comments)}
      ${createMovieCommentsFormTemplate(newCommentEmotionId, newCommentText)}
    </section>`
  );
}

export default class MovieCommentsView extends AbstractStatefulView {
  #comments = [];
  #onCommentFormSubmit = null;

  constructor({ comments, onCommentFormSubmit }) {
    super();
    this.#comments = comments;
    this.#onCommentFormSubmit = onCommentFormSubmit;

    this._updateState({
      newCommentEmotionId: null,
      newCommentText: '',
    });

    this._setHandlers();
  }

  _getTemplate() {
    return createMovieCommentsTemplate({
      comments: this.#comments,
      state: this._state,
    });
  }

  _setHandlers() {
    const commentFormElement = this.element.querySelector('.comment-form');

    commentFormElement.addEventListener('keydown', this.#commentFormKeydownHandler);
    commentFormElement.addEventListener('input', this.#commentFormInputHandler);
    commentFormElement.addEventListener('submit', this.#commentFormSubmitHandler);
  }

  #restoreEmotionFieldFocus() {
    this.element
      .querySelector(`[name="${CommentFormFieldName.EMOTION}"]:checked`)
      .focus();
  }

  #commentFormKeydownHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && isEnterEvent(evt)) {
      evt.preventDefault();

      const formElement = evt.currentTarget;
      formElement.requestSubmit();

      // 2026-05-08
      // Fix for Chromium browsers bug:
      // - Google Chrome v.148.0.7778.168 (64-bit)
      // - Microsoft Edge v.148.0.3967.70 (64-bit)
      // - Opera v.131.0.5877.24
      // - Yandex Browser 26.4.1.1026 (64-bit)
      //
      // When requestSubmit() is called without a selected radio button,
      // native validation UI appears only after additional user interaction
      // (mouse move or wheel scroll).
      //
      // The issue reproduces in a plain HTML form without CSS,
      // so it is not caused by layout or radio styling.
      //
      // Firefox 150.0.3 (64-bit) does not reproduce this issue.
      requestAnimationFrame(() => {
        formElement.reportValidity();
      });
    }
  };

  #commentFormInputHandler = ({ target: { name, value } }) => {
    switch (name) {
      case CommentFormFieldName.TEXT:
        this._updateState({ newCommentText: value });
        break;
      case CommentFormFieldName.EMOTION:
        this.updateElement({ newCommentEmotionId: value });
        this.#restoreEmotionFieldFocus();
        break;
    }
  };

  #commentFormSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#onCommentFormSubmit({
      emotionId: this._state.newCommentEmotionId,
      text: this._state.newCommentText,
    });
  };
}
