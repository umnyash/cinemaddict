/**
 * Класс, реализующий паттерн Наблюдатель
 */
export default class Observable {
  /** @type {Set<observerCallback>} Множество функций типа observerCallback */
  #observers = new Set();

  /**
   * Метод, позволяющий подписаться на оповещения
   * @param {observerCallback} observer Функция, которая будет вызываться при наступлении событий
   */
  addObserver(observer) {
    this.#observers.add(observer);
  }

  /**
   * Метод, позволяющий отписаться от оповещений
   * @param {observerCallback} observer Функция, которую больше не нужно вызывать при наступлении событий
   */
  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  /**
   * Метод для оповещения подписчиков о наступлении события
   * @param {*} event Тип события
   * @param {*} payload Дополнительная информация
   */
  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}

/**
 * Функция, которая будет вызываться при наступлении событий
 * @callback observerCallback
 * @param {*} event Тип события
 * @param {*} [payload] Дополнительная информация
 */
