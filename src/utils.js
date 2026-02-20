const MINUTES_PER_HOUR = 60;

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

export { formatDuration, formatRating, formatYear };
