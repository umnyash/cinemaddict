import { createElement } from '../framework/render.js';

function createUserTemplate() {
  return (
    `<div class="site-header__user user">
      <p class="user__rank">Movie Buff</p>
      <img class="user__avatar" src="img/avatar.webp" width="35" height="35" alt="User avatar.">
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
