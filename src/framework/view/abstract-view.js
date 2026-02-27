import { createElement } from '../render.js';

/**
 * Абстрактный класс представления
 */
export default class AbstractView {
  /** @type {HTMLElement|null} Элемент представления */
  #element = null;

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('AbstractView can\'t be instantiated directly');
    }
  }

  /**
   * Геттер для получения элемента
   * @returns {HTMLElement} Элемент представления
   */
  get element() {
    if (!this.#element) {
      this.#element = createElement(this._getTemplate());
    }

    return this.#element;
  }

  /**
   * Метод для получения разметки элемента
   * @abstract
   * @returns {string} Разметка элемента в виде строки
   */
  _getTemplate() {
    throw new Error('Abstract method not implemented: _getTemplate');
  }

  /** Метод для удаления элемента */
  removeElement() {
    this.#element = null;
  }
}
