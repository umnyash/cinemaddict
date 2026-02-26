import AbstractView from './view/abstract-view.js';

/** @enum {string} Перечисление возможных позиций для отрисовки */
const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 * Функция для создания элемента на основе разметки
 * @param {string} template Разметка в виде строки
 * @returns {HTMLElement} Созданный элемент
 */
function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

/**
 * Функция для отрисовки компонента
 * @param {AbstractView} component Компонент, который нужно отрисовать
 * @param {HTMLElement} element Элемент, относительно которого будет отрисован компонент
 * @param {string} position Позиция компонента относительно элемента. По умолчанию – `beforeend`
 */
function render(component, element, position = RenderPosition.BEFOREEND) {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can render only components');
  }

  if (element === null) {
    throw new Error('Target element doesn\'t exist');
  }

  element.insertAdjacentElement(position, component.element);
}

export { RenderPosition, createElement, render };
