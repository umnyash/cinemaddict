const KeyCode = {
  ESCAPE: 'Escape',
};

function isEscapeEvent(evt) {
  return evt.code === KeyCode.ESCAPE;
}

export { isEscapeEvent };
