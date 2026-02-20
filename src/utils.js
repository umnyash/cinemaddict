import dayjs from 'dayjs';
import dayjsDurationPlugin from 'dayjs/plugin/duration';

const DURATION_FORMAT = 'H[h] m[m]';
const DURATION_UNIT = 'minutes';

dayjs.extend(dayjsDurationPlugin);

function formatDuration(duration) {
  return dayjs.duration(duration, DURATION_UNIT).format(DURATION_FORMAT);
}

function formatRating(rating) {
  return rating.toFixed(1);
}

function formatYear(date) {
  return new Date(date).getFullYear();
}

export { formatDuration, formatRating, formatYear };
