const KeyCode = {
  ESCAPE: 'Escape',
};

function getDeclension(count, { one, many }) {
  return count === 1 ? one : many;
}

function isEscapeEvent(evt) {
  return evt.code === KeyCode.ESCAPE;
}

function updateArrayItemById(array, updatedItem) {
  const index = array.findIndex(({ id }) => id === updatedItem.id);

  if (index === -1) {
    throw new Error(`Can't update item. Id ${updatedItem.id} not found`);
  }

  array[index] = updatedItem;
}

export { getDeclension, isEscapeEvent, updateArrayItemById };
