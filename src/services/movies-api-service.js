import { ApiService } from '../framework';
import { HttpMethod } from './constants.js';

export default class MoviesApiService extends ApiService {
  async getMovies() {
    const response = await this._load({ url: 'movies' });
    const data = await ApiService.parseResponse(response);
    return data.map(this.#adaptToClient);
  }

  async updateMovie(movie) {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const data = await ApiService.parseResponse(response);
    return this.#adaptToClient(data);
  }

  #adaptToClient({
    id,
    film_info: {
      title,
      alternative_title: originalTitle,
      total_rating: rating,
      poster: posterUrl,
      age_rating: ageRating,
      director,
      writers,
      actors,
      release: {
        date: releaseDate,
        release_country: releaseCountry,
      },
      duration,
      description,
      genre: genres,
    },
    user_details: {
      watchlist: isWatchlisted,
      already_watched: isWatched,
      favorite: isFavorited,
    },
    comments,
  }) {
    return {
      id,
      title,
      originalTitle,
      rating,
      posterUrl,
      ageRating,
      director,
      writers,
      actors,
      releaseDate,
      releaseCountry,
      duration,
      description,
      genres,
      isWatchlisted,
      isWatched,
      isFavorited,
      commentsCount: comments.length,
    };
  }

  #adaptToServer({
    title,
    originalTitle,
    rating,
    posterUrl,
    ageRating,
    director,
    writers,
    actors,
    releaseDate,
    releaseCountry,
    duration,
    description,
    genres,
    isWatchlisted,
    isWatched,
    isFavorited,
  }) {
    return {
      'film_info': {
        title,
        'alternative_title': originalTitle,
        'total_rating': rating,
        poster: posterUrl,
        'age_rating': ageRating,
        director,
        writers,
        actors,
        release: {
          date: releaseDate,
          'release_country': releaseCountry,
        },
        duration,
        description,
        genre: genres,
      },
      'user_details': {
        watchlist: isWatchlisted,
        'already_watched': isWatched,
        favorite: isFavorited,
      },
    };
  }
}
