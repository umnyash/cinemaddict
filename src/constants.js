const EventType = {
  COMMENT_CREATE: 'comment/create',
  MOVIE_WATCHLISTED_TOGGLE: 'movie/watchlisted-toggle',
  MOVIE_WATCHED_TOGGLE: 'movie/watched-toggle',
  MOVIE_FAVORITED_TOGGLE: 'movie/favorited-toggle',
  MOVIE_COMMENTS_UPDATE: 'movie/comments-update',
};

const MovieStatus = {
  WATCHLISTED: 'watchlisted',
  WATCHED: 'watched',
  FAVORITED: 'favorited',
};

const SortType = {
  DATE_DESC: 'date-desc',
  RATING_DESC: 'rating-desc',
};

export { EventType, MovieStatus, SortType };
