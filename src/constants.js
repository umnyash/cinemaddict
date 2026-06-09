const EventType = {
  COMMENT_CREATE: 'comment/create',
  COMMENT_DELETE: 'comment/delete',
  COMMENTS_LOAD: 'comments/load',
  MOVIE_WATCHLISTED_TOGGLE: 'movie/watchlisted-toggle',
  MOVIE_WATCHED_TOGGLE: 'movie/watched-toggle',
  MOVIE_FAVORITED_TOGGLE: 'movie/favorited-toggle',
  MOVIE_COMMENTS_UPDATE: 'movie/comments-update',
  MOVIES_LOAD: 'movies/load',
};

const MovieStatus = {
  WATCHLISTED: 'watchlisted',
  WATCHED: 'watched',
  FAVORITED: 'favorited',
};

const RequestStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
};

const SortType = {
  DATE_DESC: 'date-desc',
  RATING_DESC: 'rating-desc',
};

export { EventType, MovieStatus, RequestStatus, SortType };
