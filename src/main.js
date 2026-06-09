import CommentsApiService from './services/comments-api-service.js';
import MoviesApiService from './services/movies-api-service.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import CatalogFilterModel from './model/catalog-filter-model.js';

import UserPresenter from './presenter/user-presenter.js';
import CatalogPresenter from './presenter/catalog-presenter.js';
import CatalogFilterPresenter from './presenter/catalog-filter-presenter.js';
import TopRatedMoviesPresenter from './presenter/top-rated-movies-presenter.js';
import MostCommentedMoviesPresenter from './presenter/most-commented-movies-presenter.js';
import MoviesCountPresenter from './presenter/movies-count-presenter.js';
import MoviePopupPresenter from './presenter/movie-popup-presenter.js';

const END_POINT = 'https://24.objects.htmlacademy.pro/cinemaddict';
const AUTHORIZATION = 'Basic umnyash';

const siteHeaderContainerElement = document.body.querySelector('.site-header__container');
const siteFooterContainerElement = document.body.querySelector('.site-footer__container');
const catalogContainerElement = document.body.querySelector('.catalog__container');
const catalogFilterContainerElement = catalogContainerElement.querySelector('.catalog__filter-wrapper');
const movieSectionsContainerElement = document.body.querySelector('.page__sections');

const moviesModel = new MoviesModel({
  apiService: new MoviesApiService(END_POINT, AUTHORIZATION),
});

const commentsModel = new CommentsModel({
  apiService: new CommentsApiService(END_POINT, AUTHORIZATION),
});

const catalogFilterModel = new CatalogFilterModel();

const commentsModelEventHandler = (_eventType, { movieId, comments }) => {
  moviesModel.updateCommentsCount(movieId, comments.length);
};

commentsModel.addObserver(commentsModelEventHandler);

const userPresenter = new UserPresenter({
  containerElement: siteHeaderContainerElement,
  moviesModel,
});

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

new TopRatedMoviesPresenter({
  containerElement: movieSectionsContainerElement,
  moviesModel,
  moviePopupPresenter,
});

new MostCommentedMoviesPresenter({
  containerElement: movieSectionsContainerElement,
  moviesModel,
  moviePopupPresenter,
});

new MoviesCountPresenter({
  containerElement: siteFooterContainerElement,
  moviesModel,
});

userPresenter.init();
catalogPresenter.init();
catalogFilterPresenter.init();

moviesModel.init();
