import dayjs from 'dayjs';
import dayjsDurationPlugin from 'dayjs/plugin/duration';
import { DurationUnit, TimeUnit } from './constants.js';
import { emotionIds } from '../data';
import { NAMES } from './names.js';
import { generateRandomInt, getRandomArrayItem } from './utils.js';

const TEXTS = [
  'Integer egestas sagittis justo.',
  'Phasellus interdum efficitur lectus, a lobortis nulla dapibus ut.',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
  'Nunc pellentesque nulla eget hendrerit egestas.',
  'Quisque tempor nunc tortor, ut blandit nulla dictum ac.',
  'Sed ex turpis, iaculis quis libero non, auctor porttitor justo.',
  'Phasellus vel odio quis sapien lacinia fermentum.',
  'Suspendisse quis turpis non purus dapibus ultricies eget quis nibh.',
  'Phasellus rutrum efficitur mi, vitae porttitor mauris.',
  'Vestibulum varius vitae neque pretium convallis.',
  'Nam vitae placerat lacus.',
  'Donec ut lorem ut nisi rutrum blandit sit amet sed mauris.',
  'Nullam nibh nisi, consectetur sit amet viverra ac, ornare eget mi.',
];

dayjs.extend(dayjsDurationPlugin);

const commentDateOffsets = [
  {
    min: { value: 1, unit: DurationUnit.SECONDS },
    max: { value: 1, unit: DurationUnit.MINUTES },
  },
  {
    min: { value: 1, unit: DurationUnit.MINUTES },
    max: { value: 1, unit: DurationUnit.HOURS },
  },
  {
    min: { value: 1, unit: DurationUnit.HOURS },
    max: { value: 1, unit: DurationUnit.DAYS },
  },
  {
    min: { value: 1, unit: DurationUnit.DAYS },
    max: { value: 1, unit: DurationUnit.MONTHS },
  },
  {
    min: { value: 1, unit: DurationUnit.MONTHS },
    max: { value: 1, unit: DurationUnit.YEARS },
  },
  {
    min: { value: 1, unit: DurationUnit.YEARS },
    max: { value: 10, unit: DurationUnit.YEARS },
  },
];

function generateCommentDate() {
  const { min, max } = getRandomArrayItem(commentDateOffsets);

  const offsetInMilliseconds = generateRandomInt(
    dayjs.duration(min.value, min.unit).asMilliseconds(),
    dayjs.duration(max.value, max.unit).asMilliseconds(),
  );

  return dayjs()
    .subtract(offsetInMilliseconds, TimeUnit.MILLISECOND)
    .toISOString();
}

function generateMockComment() {
  return {
    id: crypto.randomUUID(),
    text: getRandomArrayItem(TEXTS),
    emotion: getRandomArrayItem(emotionIds),
    date: generateCommentDate(),
    author: {
      name: getRandomArrayItem(NAMES),
    },
  };
}

function generateMockComments(count) {
  return Array.from({ length: count }, generateMockComment);
}

export { generateMockComments };
