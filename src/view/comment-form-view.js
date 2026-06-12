import { AbstractStatefulView } from '../framework';
import { emotions, emotionIds } from '../data';
import { isEnterEvent } from '../utils';

const CommentFormFieldName = {
  EMOTION: 'emotion',
  TEXT: 'text',
};

const emptyComment = {
  currentEmotionId: null,
  text: '',
};

function createCommentFormEmotionsTemplate(currentEmotionId, isDisabled) {
  return (
    `<fieldset class="comment-form__emotions">
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
            ${isDisabled ? 'disabled' : ''}
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
    </fieldset>`
  );
}

function createCommentFormTextFieldTemplate(text, isDisabled) {
  return (
    `<label class="comment-form__field text-area">
      <textarea class="text-area__control" name="${CommentFormFieldName.TEXT}" rows="1" placeholder="Good movie!" required ${isDisabled ? 'disabled' : ''}>${text}</textarea>
      <span class="text-area__label">Select reaction below and write comment here</span>
    </label>`
  );
}

function createCommentFormTemplate({ currentEmotionId, text, isDisabled }) {
  return (
    `<form class="comment-form" action="https://echo.htmlacademy.ru/courses" method="post">
      <div class="comment-form__emotion-wrapper" aria-hidden="true">
        ${currentEmotionId ? `<img class="comment-form__emotion" src="${emotions[currentEmotionId].iconUrl}" width="55" height="55" alt="">` : ''}
      </div>
      ${createCommentFormTextFieldTemplate(text, isDisabled)}
      ${createCommentFormEmotionsTemplate(currentEmotionId, isDisabled)}
    </form>`
  );
}

export default class CommentForm extends AbstractStatefulView {
  #initialState = {
    ...emptyComment,
    isDisabled: false,
  };

  #onCommentFormSubmit = null;

  constructor({ onCommentFormSubmit }) {
    super();
    this.#onCommentFormSubmit = onCommentFormSubmit;

    this._updateState(this.#initialState);
    this._setHandlers();
  }

  _getTemplate() {
    return createCommentFormTemplate(this._state);
  }

  _setHandlers() {
    this.element.addEventListener('keydown', this.#commentFormKeydownHandler);
    this.element.addEventListener('input', this.#commentFormInputHandler);
    this.element.addEventListener('submit', this.#commentFormSubmitHandler);
  }

  disable() {
    this._updateElement({ isDisabled: true });
  }

  enable() {
    this._updateElement({ isDisabled: false });
  }

  reset() {
    this._updateElement(this.#initialState);
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
        this._updateState({ text: value });
        break;
      case CommentFormFieldName.EMOTION:
        this._updateElement({ currentEmotionId: value });
        this.#restoreEmotionFieldFocus();
        break;
    }
  };

  #commentFormSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#onCommentFormSubmit({
      emotionId: this._state.currentEmotionId,
      text: this._state.text,
    });
  };
}
