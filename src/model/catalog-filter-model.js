export default class CatalogFilterModel {
  #filter = {
    status: null,
  };

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
  }
}
