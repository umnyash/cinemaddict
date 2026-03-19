import dayjs from 'dayjs';
import dayjsRelativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(dayjsRelativeTimePlugin);

function formatDate(date, format) {
  return dayjs(date).format(format);
}

function getTimeAgo(date) {
  return dayjs(date).fromNow();
}

function getYear(date) {
  return new Date(date).getFullYear();
}

export { formatDate, getTimeAgo, getYear };
