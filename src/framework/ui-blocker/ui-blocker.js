import { createElement } from '../render.js';
import './ui-blocker.css';

const ACTIVE_CLASS_NAME = 'ui-blocker--on';

/**
 * Класс для блокировки интерфейса
 */
export default class UiBlocker {
  /** @type {?number} Время до блокировки интерфейса в миллисекундах */
  #delay = null;

  /** @type {?number} Минимальное время блокировки интерфейса в миллисекундах */
  #minDuration = null;

  /** @type {?HTMLElement|null} Элемент, блокирующий интерфейс */
  #element = null;

  /** @type {?number} Время вызова метода block */
  #startTime = null;

  /** @type {?number} Время вызова метода unblock */
  #endTime = null;

  /** @type {?number} Идентификатор таймера */
  #timerId = null;

  /**
   * @param {Object} config Объект с настройками блокировщика
   * @param {number} config.delay Время до блокировки интерфейса в миллисекундах. Если вызвать метод unblock раньше, то интерфейс заблокирован не будет
   * @param {number} config.minDuration Минимальное время блокировки в миллисекундах. Минимальная длительность блокировки
   */
  constructor({ delay, minDuration }) {
    this.#delay = delay;
    this.#minDuration = minDuration;

    this.#element = createElement('<div class="ui-blocker"></div>');
    document.body.append(this.#element);
  }

  /** Метод для блокировки интерфейса */
  block() {
    this.#startTime = Date.now();
    this.#timerId = setTimeout(this.#on, this.#delay);
  }

  /** Метод для разблокировки интерфейса */
  unblock() {
    this.#endTime = Date.now();
    const currentDuration = this.#endTime - this.#startTime;

    if (currentDuration < this.#delay) {
      clearTimeout(this.#timerId);
      return;
    }

    if (currentDuration >= this.#minDuration) {
      this.#off();
      return;
    }

    setTimeout(this.#off, this.#minDuration - currentDuration);
  }

  /** Метод, добавляющий CSS-класс элементу */
  #on = () => {
    this.#element.classList.add(ACTIVE_CLASS_NAME);
  };

  /** Метод, убирающий CSS-класс с элемента */
  #off = () => {
    this.#element.classList.remove(ACTIVE_CLASS_NAME);
  };
}
