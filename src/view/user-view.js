import { createElement } from '../framework';

function createUserTemplate() {
  return (
    `<div class="site-header__user user">
      <p class="user__rank">Movie Buff</p>
      <img class="user__avatar" src="images/avatar.png" width="35" height="35" alt="User avatar.">
    </div>`
  );
}

export default class UserView {
  getTemplate() {
    return createUserTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
