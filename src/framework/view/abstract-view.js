import { createElement } from '../render.js';
import './abstract-view.css';

/** @const {string} Название анимации, реализующей эффект "покачивания головой" */
const SHAKE_ANIMATION_NAME = 'shake';

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
    this.#element ??= createElement(this._getTemplate());
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

  /**
   * Метод, реализующий эффект "покачивания головой"
   * @param {shakeCallback} [callback] Функция, которая будет вызвана после завершения анимации
   * @param {HTMLElement} [targetElement] Элемент, к которому будет применена анимация
   */
  shake(callback, targetElement = this.element) {
    const animationEndHandler = ({ animationName }) => {
      if (animationName === SHAKE_ANIMATION_NAME) {
        targetElement.removeEventListener('animationend', animationEndHandler);
        targetElement.classList.remove(SHAKE_ANIMATION_NAME);
        callback?.();
      }
    };

    targetElement.addEventListener('animationend', animationEndHandler);
    targetElement.classList.add(SHAKE_ANIMATION_NAME);
  }
}

/**
 * Функция, которая будет вызвана методом shake после завершения анимации
 * @callback shakeCallback
 */
