import { render, replace } from '../framework';
import { EventType } from '../constants.js';
import { determineUserRank } from '../utils';
import UserView from '../view/user-view.js';

export default class UserPresenter {
  #containerElement = null;
  #moviesModel = null;
  #userComponent = null;
  #rank = null;

  constructor({ containerElement, moviesModel }) {
    this.#containerElement = containerElement;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#moviesModelEventHandler);
  }

  get #watchedMoviesCount() {
    return this.#moviesModel.movies
      .filter(({ isWatched }) => isWatched)
      .length;
  }

  init() {
    const newRank = determineUserRank(this.#watchedMoviesCount);

    if (newRank && newRank === this.#rank) {
      return;
    }

    const newUserComponent = new UserView({ rank: newRank });

    if (this.#userComponent) {
      replace(newUserComponent, this.#userComponent);
    } else {
      render(newUserComponent, this.#containerElement);
    }

    this.#userComponent = newUserComponent;
    this.#rank = newRank;
  }

  #moviesModelEventHandler = (eventType) => {
    if (eventType === EventType.MOVIE_WATCHED_TOGGLE || eventType === EventType.MOVIES_LOAD) {
      this.init();
    }
  };
}
