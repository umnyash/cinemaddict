import { AbstractView } from '../framework';

function createMoviePopupTemplate() {
  return (
    `<dialog class="popup popup--position_right">
      <div class="popup__inner">
        <button class="popup__close-button">
          <span class="visually-hidden">Close</span>
        </button>
        <article class="popup__movie movie">
          <h2 class="movie__title title title--size_xxl">The Great Flamarion</h2>
          <p class="movie__subtitle">Original: The Great Flamarion</p>
          <p class="movie__rating">
            <span class="visually-hidden">Rating:</span> 8.9
          </p>
          <div class="movie__poster-wrapper">
            <img class="movie__poster" src="images/posters/the-great-flamarion.jpg" width="338" height="500" alt="Poster.">
            <p class="movie__age-rating">
              <span class="visually-hidden">Age rating:</span> 18+
            </p>
          </div>
          <dl class="movie__details">
            <dt>Director</dt>
            <dd class="movie__details-value">Anthony Mann</dd>
            <dt>Writers</dt>
            <dd class="movie__details-value">Anne Wigton, Heinz Herald, Richard Weil</dd>
            <dt>Actors</dt>
            <dd class="movie__details-value">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</dd>
            <dt>Release Date</dt>
            <dd class="movie__details-value">
              <time datetime="1945-03-30">30 March 1945</time>
            </dd>
            <dt>Duration</dt>
            <dd class="movie__details-value">1h 18m</dd>
            <dt>Country</dt>
            <dd class="movie__details-value">USA</dd>
            <dt>Genres</dt>
            <dd class="movie__details-value movie__details-value--list">
              <span>Drama</span>
              <span>Film-Noir</span>
              <span>Mystery</span>
            </dd>
          </dl>
          <p class="movie__description">
            The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion's other assistant. Flamarion falls in love with Connie, the movie's femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.
          </p>
          <div class="movie__actions">
            <button class="icon-button icon-button--icon_list-add" aria-pressed="false">
              <span class="icon-button__text">Add to watchlist</span>
            </button>
            <button class="icon-button icon-button--icon_checkmark" aria-pressed="true">
              <span class="icon-button__text">Already watched</span>
            </button>
            <button class="icon-button icon-button--icon_star" aria-pressed="false">
              <span class="icon-button__text">Add to favorites</span>
            </button>
          </div>
        </article>
      </div>
    </dialog>`
  );
}

export default class MoviePopupView extends AbstractView {
  _getTemplate() {
    return createMoviePopupTemplate();
  }
}
