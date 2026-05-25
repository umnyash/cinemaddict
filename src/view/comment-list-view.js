import { AbstractView } from '../framework';
import { emotions } from '../data';
import { escapeHtml, formatCommentDate } from '../utils';

function createCommentListItemTemplate(comment) {
  const { id, text, emotionId, date, author: { name } } = comment;
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
      <button class="comment__delete-button link" type="button" data-comment-id="${id}">Delete</button>
    </li>`
  );
}

function createCommentListTemplate(comments) {
  return (
    `<ul class="comments__list comment-list">
      ${comments.map(createCommentListItemTemplate).join('')}
    </ul>`
  );
}

export default class CommentListView extends AbstractView {
  #comments = null;
  #onCommentDeleteButtonClick = null;

  constructor({ comments, onCommentDeleteButtonClick }) {
    super();
    this.#comments = comments;
    this.#onCommentDeleteButtonClick = onCommentDeleteButtonClick;

    this.element.addEventListener('click', this.#listClickHandler);
  }

  _getTemplate() {
    return createCommentListTemplate(this.#comments);
  }

  #listClickHandler = ({ target }) => {
    if (target.classList.contains('comment__delete-button')) {
      this.#onCommentDeleteButtonClick(target.dataset.commentId);
    }
  };
}
