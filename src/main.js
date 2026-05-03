import { render } from './framework/render.js';
import UserView from './view/user-view.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import CatalogFilterModel from './model/catalog-filter-model.js';

import CatalogPresenter from './presenter/catalog-presenter.js';
import CatalogFilterPresenter from './presenter/catalog-filter-presenter.js';
import TopRatedMoviesPresenter from './presenter/top-rated-movies-presenter.js';
import MoviesCountPresenter from './presenter/movies-count-presenter.js';
import MoviePopupPresenter from './presenter/movie-popup-presenter.js';

const siteHeaderContainerElement = document.body.querySelector('.site-header__container');
const siteFooterContainerElement = document.body.querySelector('.site-footer__container');
const catalogContainerElement = document.body.querySelector('.catalog__container');
const catalogFilterContainerElement = catalogContainerElement.querySelector('.catalog__filter-wrapper');
const movieSectionsContainerElement = document.body.querySelector('.page__sections');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const catalogFilterModel = new CatalogFilterModel();

const moviePopupPresenter = new MoviePopupPresenter({
  containerElement: document.body,
  moviesModel,
  commentsModel,
});

const catalogPresenter = new CatalogPresenter({
  containerElement: catalogContainerElement,
  filterModel: catalogFilterModel,
  moviesModel,
  moviePopupPresenter,
});

const catalogFilterPresenter = new CatalogFilterPresenter({
  containerElement: catalogFilterContainerElement,
  filterModel: catalogFilterModel,
  moviesModel,
});

const topRatedMoviesPresenter = new TopRatedMoviesPresenter({
  containerElement: movieSectionsContainerElement,
  moviesModel,
  moviePopupPresenter,
});

const moviesCountPresenter = new MoviesCountPresenter({
  containerElement: siteFooterContainerElement,
  moviesModel,
});

render(new UserView(), siteHeaderContainerElement);

catalogPresenter.init();
catalogFilterPresenter.init();
topRatedMoviesPresenter.init();
moviesCountPresenter.init();
