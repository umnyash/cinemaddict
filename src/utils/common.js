const KeyCode = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
};

function getDeclension(count, { one, many }) {
  return count === 1 ? one : many;
}

function getUniqueRandomArrayItems(array, count) {
  if (count > array.length) {
    throw new Error(
      `Cannot select ${count} unique items: the array contains only ${array.length}.`
    );
  }

  return shuffle(array).slice(0, count);
}

function isEnterEvent(evt) {
  return evt.code === KeyCode.ENTER;
}

function isEscapeEvent(evt) {
  return evt.code === KeyCode.ESCAPE;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function updateArrayItemById(array, updatedItem) {
  const index = array.findIndex(({ id }) => id === updatedItem.id);

  if (index === -1) {
    throw new Error(`Can't update item. Id ${updatedItem.id} not found`);
  }

  array[index] = updatedItem;
}

export {
  getDeclension,
  getUniqueRandomArrayItems,
  isEnterEvent,
  isEscapeEvent,
  updateArrayItemById,
};
