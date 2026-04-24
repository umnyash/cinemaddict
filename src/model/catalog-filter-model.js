import { Observable } from '../framework';

export default class CatalogFilterModel extends Observable {
  #filter = {
    status: null,
  };

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
    this._notify();
  }
}
