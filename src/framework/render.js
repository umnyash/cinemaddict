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

/**
 * Функция для замены одного компонента на другой
 * @param {AbstractView} newComponent Компонент, которым нужно заменить
 * @param {AbstractView} oldComponent Компонент, который нужно заменить
 */
function replace(newComponent, oldComponent) {
  if (!(newComponent instanceof AbstractView && oldComponent instanceof AbstractView)) {
    throw new Error('Can replace only components');
  }

  const newElement = newComponent.element;
  const oldElement = oldComponent.element;

  const parentElement = oldElement.parentElement;

  if (parentElement === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parentElement.replaceChild(newElement, oldElement);
}

/**
 * Функция для удаления компонента
 * @param {AbstractView} component Компонент, который нужно удалить
 */
function remove(component) {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
}

export { RenderPosition, createElement, render, replace, remove };
