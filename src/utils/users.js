const ranks = [
  { title: 'Movie Buff', threshold: 21 },
  { title: 'Fan', threshold: 11 },
  { title: 'Novice', threshold: 1 },
];

function determineUserRank(watchedMoviesCount) {
  for (const rank of ranks) {
    if (watchedMoviesCount >= rank.threshold) {
      return rank.title;
    }
  }

  return null;
}

export { determineUserRank };
