import { render } from './framework/render.js';
import UserView from './view/user-view.js';
import MoviesCountView from './view/movies-count-view.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

import CatalogPresenter from './presenter/catalog-presenter.js';
import CatalogFilterPresenter from './presenter/catalog-filter-presenter.js';

const siteHeaderContainerElement = document.body.querySelector('.site-header__container');
const siteFooterContainerElement = document.body.querySelector('.site-footer__container');
const catalogContainerElement = document.body.querySelector('.catalog__container');
const catalogFilterContainerElement = catalogContainerElement.querySelector('.catalog__filter-wrapper');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const catalogPresenter = new CatalogPresenter({
  containerElement: catalogContainerElement,
  popupContainerElement: document.body,
  moviesModel,
  commentsModel,
});

const catalogFilterPresenter = new CatalogFilterPresenter({
  containerElement: catalogFilterContainerElement,
});

render(new UserView(), siteHeaderContainerElement);
render(new MoviesCountView(), siteFooterContainerElement);

catalogPresenter.init();
catalogFilterPresenter.init();
