import { AbstractView } from '../framework';

function createCommentListTemplate() {
  return '<ul class="comments__list comment-list"></ul>';
}

export default class CommentListView extends AbstractView {
  _getTemplate() {
    return createCommentListTemplate();
  }
}
