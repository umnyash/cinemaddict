function normalizeIntRange(from, to) {
  const min = Math.ceil(Math.min(from, to));
  const max = Math.floor(Math.max(from, to));

  if (min > max) {
    throw new Error(`No integers exist in the range [${from}, ${to}].`);
  }

  return [min, max];
}

function generateRandomIntFromNormalizedRange(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function generateRandomInt(from, to) {
  const [min, max] = normalizeIntRange(from, to);
  return generateRandomIntFromNormalizedRange(min, max);
}

function generateRandomFloat(from, to, fractionalPartLength = 1) {
  const factor = Math.pow(10, fractionalPartLength);

  return generateRandomInt(from * factor, to * factor) / factor;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = generateRandomIntFromNormalizedRange(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function getUniqueRandomInts(range, count) {
  const [min, max] = normalizeIntRange(range.from, range.to);
  const rangeLength = max - min + 1;

  if (rangeLength < count) {
    throw new Error(
      `Cannot generate ${count} unique integers: the range [${range.from}, ${range.to}] contains only ${rangeLength}.`
    );
  }

  if (count > rangeLength / 2) {
    const shuffledInts = shuffle(Array.from({ length: rangeLength }, (_item, index) => index + min));
    return shuffledInts.slice(0, count);
  } else {
    const set = new Set();

    while (set.size < count) {
      set.add(generateRandomIntFromNormalizedRange(min, max));
    }

    return Array.from(set);
  }
}

function getRandomArrayItem(array) {
  return array[generateRandomIntFromNormalizedRange(0, Math.max(array.length - 1, 0))];
}

function getUniqueRandomArrayItems(array, count = generateRandomIntFromNormalizedRange(0, array.length)) {
  if (count > array.length) {
    throw new Error(
      `Cannot select ${count} unique items: the array contains only ${array.length}.`
    );
  }

  return getUniqueRandomInts({ from: 0, to: array.length - 1 }, count).map((int) => array[int]);
}

export {
  generateRandomInt,
  generateRandomFloat,
  getRandomArrayItem,
  getUniqueRandomArrayItems,
};
