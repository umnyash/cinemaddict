import { render } from './framework/render.js';
import UserView from './view/user-view.js';
import MoviesCountView from './view/movies-count-view.js';

const siteHeaderContainerElement = document.body.querySelector('.site-header__container');
const siteFooterContainerElement = document.body.querySelector('.site-footer__container');

render(new UserView(), siteHeaderContainerElement);
render(new MoviesCountView(), siteFooterContainerElement);
