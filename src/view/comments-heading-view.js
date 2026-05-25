import { AbstractView } from '../framework';

function createCommentsHeadingTemplate(commentsCount) {
  return `<h3 class="comments__title title title--size_m">Comments ${commentsCount}</h3>`;
}

export default class CommentsHeadingView extends AbstractView {
  #commentsCount = null;

  constructor({ commentsCount }) {
    super();
    this.#commentsCount = commentsCount;
  }

  _getTemplate() {
    return createCommentsHeadingTemplate(this.#commentsCount);
  }
}
