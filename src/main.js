import { render } from './framework/render.js';
import UserView from './view/user-view.js';
import MoviesCountView from './view/movies-count-view.js';
import CatalogPresenter from './presenter/catalog-presenter.js';

const siteHeaderContainerElement = document.body.querySelector('.site-header__container');
const siteFooterContainerElement = document.body.querySelector('.site-footer__container');
const catalogContainerElement = document.body.querySelector('.catalog__container');

const catalogPresenter = new CatalogPresenter({ catalogContainerElement });

render(new UserView(), siteHeaderContainerElement);
render(new MoviesCountView(), siteFooterContainerElement);

catalogPresenter.init();
