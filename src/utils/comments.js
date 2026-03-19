import { getTimeAgo } from './date.js';

function formatCommentDate(date) {
  return getTimeAgo(date);
}

export { formatCommentDate };
