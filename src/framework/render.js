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
  element.insertAdjacentElement(position, component.getElement());
}

export { RenderPosition, createElement, render };
