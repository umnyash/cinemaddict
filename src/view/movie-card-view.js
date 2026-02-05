import { createElement } from '../framework';

function createMovieCardTemplate() {
  return (
    `<li class="movies-list__item">
      <article class="movie-card">
        <div>
          <h3 class="movie-card__title">
            <a class="movie-card__link" href="#">The Dance of Life</a>
          </h3>
          <p class="movie-card__rating">
            <span class="visually-hidden">Rating:</span> 8.3
          </p>
        </div>
        <img class="movie-card__poster" src="images/posters/the-dance-of-life.jpg" width="232" height="342" alt="Poster." loading="lazy">
        <dl class="movie-card__details">
          <dt class="visually-hidden">Release year:</dt>
          <dd class="movie-card__details-value">
            <time>1929</time>
          </dd>
          <dt class="visually-hidden">Duration:</dt>
          <dd class="movie-card__details-value">1h 55m</dd>
          <dt class="visually-hidden">Genre:</dt>
          <dd class="movie-card__details-value">Musical</dd>
        </dl>
        <p class="movie-card__description">
          Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…
        </p>
        <p class="movie-card__comments-count">5 comments</p>
        <div class="movie-card__actions">
          <button class="icon-button icon-button--icon_list-add icon-button--compact" aria-pressed="false">
            <span class="icon-button__text">Add to watchlist</span>
          </button>
          <button class="icon-button icon-button--icon_checkmark icon-button--compact" aria-pressed="false">
            <span class="icon-button__text">Already watched</span>
          </button>
          <button class="icon-button icon-button--icon_star icon-button--compact" aria-pressed="false">
            <span class="icon-button__text">Add to favorites</span>
          </button>
        </div>
      </article>
    </li>`
  );
}

export default class MovieCardView {
  getTemplate() {
    return createMovieCardTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }
}
