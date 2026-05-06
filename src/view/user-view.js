import { AbstractView } from '../framework';

function createUserTemplate(rank) {
  return (
    `<div class="site-header__user user">
      ${rank ? `<p class="user__rank">${rank}</p>` : ''}
      <img class="user__avatar" src="images/avatar.png" width="35" height="35" alt="User avatar.">
    </div>`
  );
}

export default class UserView extends AbstractView {
  #rank = null;

  constructor({ rank }) {
    super();
    this.#rank = rank;
  }

  _getTemplate() {
    return createUserTemplate(this.#rank);
  }
}
