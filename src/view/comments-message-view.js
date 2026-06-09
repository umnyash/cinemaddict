import { AbstractView } from '../framework';

const MessageVariant = {
  LOADING: 'loading',
  LOAD_FAILED: 'load failed',
};

const messages = {
  [MessageVariant.LOADING]: 'Loading<span class="animated-ellipsis"><span>...</span></span>',
  [MessageVariant.LOAD_FAILED]: 'We couldn’t load comments. Please try again later',
};

function createCommentsMessageTemplate(variant) {
  return `<p class="comments__message">${messages[variant]}</p>`;
}

export default class CommentsMessage extends AbstractView {
  #variant = null;

  constructor({ variant }) {
    super();
    this.#variant = variant;
  }

  _getTemplate() {
    return createCommentsMessageTemplate(this.#variant);
  }
}

export { MessageVariant };
