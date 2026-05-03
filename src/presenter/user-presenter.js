import { render } from '../framework';
import UserView from '../view/user-view.js';

export default class UserPresenter {
  #containerElement = null;

  constructor({ containerElement }) {
    this.#containerElement = containerElement;
  }

  init() {
    render(new UserView(), this.#containerElement);
  }
}
