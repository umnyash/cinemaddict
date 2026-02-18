import dayjs from 'dayjs';
import dayjsDurationPlugin from 'dayjs/plugin/duration';
import { DurationUnit, TimeUnit } from './const.js';
import { NAMES } from './names.js';

import {
  generateRandomInt,
  generateRandomFloat,
  getRandomArrayItem,
  getUniqueRandomArrayItems,
} from './utils.js';

const TITLES = [
  'Made for Each Other',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with the Golden Arm',
];

const POSTER_URLS = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',
];

const DESCRIPTIONS = [
  'John Mason (James Stewart) is a young, somewhat timid attorney in New York City.',
  'In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and lover in the world and "the most remarkable, extraordinary fellow," a claim which is challenged by Popeye\'s arrival on his island with Olive Oyl and J.',
  'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer.',
  'The Martians Momar (Mom Martian) and Kimar (King Martian) are worried that their children Girmar (Girl Martian) and Bomar (Boy Martian) are watching too much Earth television, most notably station KID-TV\'s interview with Santa Claus in his workshop at Earth\'s North Pole.',
  'Burlesque comic Ralph "Skid" Johnson, and specialty dancer Bonny Lee King, end up together on a cold, rainy night at a train station, after she fails an audition with a vaudeville company and he complains about her treatment by the impresario of the show and is fired. They decide to team up and apply for work with a much better show on "the big wheel" called the High Steppers Burlesque Company in Milwaukee, Wisconsin, run by Lefty Miller.',
  'The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion\'s other assistant.Flamarion falls in love with Connie, the movie\'s femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.',
  'Frankie Machine is released from the federal Narcotic Farm in Lexington, Kentucky, with a set of drums and a new outlook on life, and returns to his run-down neighborhood on the North Side of Chicago. A drug addict (the drug is never named, but heroin is strongly implied), Frankie became clean in prison. On the outside, he greets friends and acquaintances. Sparrow, who runs a con selling homeless dogs, clings to him like a young brother, but Schwiefka, whom Frankie used to deal for in his illegal card game, has more sinister reasons for welcoming him back, as does Louie, Machine\'s former drug dealer.',
];

const GENRES = [
  'Adventure',
  'Cartoon',
  'Comedy',
  'Documentary',
  'Drama',
  'Film-Noir',
  'Musical',
  'Mystery',
  'Romance',
  'Western',
];

const AGE_RATINGS = [0, 6, 12, 16, 18];

const RELEASE_DATE_MAX_OFFSET_IN_YEARS = 50;

const COUNTRIES = [
  'France',
  'Germany',
  'Japan',
  'Poland',
  'USA',
];

const Duration = {
  MIN: 45,
  MAX: 180,
};

const Rating = {
  MIN: 0.1,
  MAX: 10,
};

const GenresCount = {
  MIN: 1,
  MAX: 3,
};

const WritersCount = {
  MIN: 2,
  MAX: 5,
};

const ActorsCount = {
  MIN: 3,
  MAX: 6,
};

const CommentsCount = {
  MIN: 0,
  MAX: 12,
};

dayjs.extend(dayjsDurationPlugin);

function generateReleaseDate() {
  const maxOffsetInMilliseconds = dayjs
    .duration(RELEASE_DATE_MAX_OFFSET_IN_YEARS, DurationUnit.YEARS)
    .asMilliseconds();

  return dayjs()
    .subtract(maxOffsetInMilliseconds * Math.random(), TimeUnit.MILLISECOND)
    .toISOString();
}

function generateMockMovie() {
  return {
    id: crypto.randomUUID(),
    commentsCount: generateRandomInt(CommentsCount.MIN, CommentsCount.MAX),
    title: getRandomArrayItem(TITLES),
    originalTitle: getRandomArrayItem(TITLES),
    rating: generateRandomFloat(Rating.MIN, Rating.MAX),
    posterUrl: getRandomArrayItem(POSTER_URLS),
    ageRating: getRandomArrayItem(AGE_RATINGS),
    director: getRandomArrayItem(NAMES),
    writers: getUniqueRandomArrayItems(NAMES, generateRandomInt(WritersCount.MIN, WritersCount.MAX)),
    actors: getUniqueRandomArrayItems(NAMES, generateRandomInt(ActorsCount.MIN, ActorsCount.MAX)),
    releaseDate: generateReleaseDate(),
    releaseCountry: getRandomArrayItem(COUNTRIES),
    duration: generateRandomInt(Duration.MIN, Duration.MAX),
    description: getRandomArrayItem(DESCRIPTIONS),
    genres: getUniqueRandomArrayItems(GENRES, generateRandomInt(GenresCount.MIN, GenresCount.MAX)),
    isOnWatchlist: Boolean(generateRandomInt(0, 1)),
    isWatched: Boolean(generateRandomInt(0, 1)),
    isFavorite: Boolean(generateRandomInt(0, 1)),
  };
}

function generateMockMovies(count) {
  return Array.from({ length: count }, generateMockMovie);
}

export { generateMockMovies };
