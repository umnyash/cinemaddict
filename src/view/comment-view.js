import { AbstractView } from '../framework';
import { emotions } from '../data';
import { escapeHtml, formatCommentDate } from '../utils';

function createCommentTemplate(comment) {
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

export default class CommentView extends AbstractView {
  #comment = null;
  #onDeleteButtonClick = null;

  constructor({ comment, onDeleteButtonClick }) {
    super();
    this.#comment = comment;
    this.#onDeleteButtonClick = onDeleteButtonClick;

    this.element.querySelector('.comment__delete-button')
      .addEventListener('click', this.#deleteButtonClickHandler);
  }

  _getTemplate() {
    return createCommentTemplate(this.#comment);
  }

  #deleteButtonClickHandler = () => {
    this.#onDeleteButtonClick(this.#comment.id);
  };
}
