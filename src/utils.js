import dayjs from 'dayjs';

const MINUTES_PER_HOUR = 60;
const DATE_FORMAT = 'D MMMM YYYY';

const KeyCode = {
  ESCAPE: 'Escape',
};

function formatDate(date) {
  return dayjs(date).format(DATE_FORMAT);
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);

  if (hours === 0) {
    return `${minutes}m`;
  }

  const remainingMinutes = minutes % MINUTES_PER_HOUR;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatRating(rating) {
  return rating.toFixed(1);
}

function formatYear(date) {
  return new Date(date).getFullYear();
}

function isEscapeEvent(evt) {
  return evt.code === KeyCode.ESCAPE;
}

export { formatDate, formatDuration, formatRating, formatYear, isEscapeEvent };
