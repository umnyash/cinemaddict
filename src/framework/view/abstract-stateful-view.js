import AbstractView from './abstract-view.js';

/**
 * Абстрактный класс представления с состоянием
 */
export default class AbstractStatefulView extends AbstractView {
  /** @type {Object} Объект состояния */
  _state = {};

  /**
   * Метод для обновления состояния и перерисовки элемента
   * @param {Object} stateUpdate Объект с обновлённой частью состояния
   */
  updateElement(stateUpdate) {
    this._updateState(stateUpdate);
    this.#rerenderElement();
    this._setHandlers();
  }

  /**
   * Метод для обновления состояния
   * @param {Object} stateUpdate Объект с обновлённой частью состояния
   */
  _updateState(stateUpdate) {
    this._state = structuredClone({ ...this._state, ...stateUpdate });
  }

  /**
   * Метод для установки обработчиков, в том числе после перерисовки элемента
   * @abstract
   */
  _setHandlers() {
    throw new Error('Abstract method not implemented: _setHandlers');
  }

  /** Метод для перерисовки элемента */
  #rerenderElement() {
    const currentElement = this.element;
    const parentElement = currentElement.parentElement;

    this.removeElement();

    const newElement = this.element;
    parentElement.replaceChild(newElement, currentElement);
  }
}
