import { Director, Movie } from '../models/index.js';
import {
  DirectorModel,
  MovieModel,
  Resolver,
  ReviewModel,
  Genre
} from '../types.js';
import { 
  adminRequired,
  authRequired,
  mergeResolvers
} from '../utils/resolver.js';

const getMovieById: Resolver<MovieModel> = async (_, { id }) => {
  return await Movie.findByPk(id) as MovieModel;
};

const getMoviesByDirectorId: Resolver<MovieModel[]> = async (
  _,
  { directorId }
) => {
  return await Movie.findAll({ 
    where: { DirectorId: directorId }
  }) as MovieModel[];
};

const createMovie: Resolver<MovieModel> = async (
  _, 
  { directorId, title, genre, release }
) => {
  const director = await Director.findByPk(directorId) as DirectorModel;
  if (!director)
    throw new Error(`Director id ${directorId} not found.`);

  const movie = await Movie.findOne({
    where: { title, DirectorId: directorId }
  });

  if (movie)
    throw new Error(
      `Movie ${title} with directorId=${directorId} already exists.`
    );

  if (!(Object.values(Genre).includes(genre as Genre)))
    throw new Error(`Invalid genre ${genre}.`);

  return await Movie.create({
    title,
    genre,
    release,
    DirectorId: directorId
  }) as MovieModel;
};

const updateMovie: Resolver<MovieModel> = async (
  _,
  { id, title, genre, release, directorId }
) => {
  const movie = await Movie.findByPk(id) as MovieModel;
  if (!movie)
    throw new Error(`Movie with id=${id} not found.`);

  if (genre && !(Object.values(Genre).includes(genre as Genre)))
    throw new Error(`Invalid genre ${genre}.`);
  
  if (directorId) {
    const director = await Director.findByPk(directorId) as DirectorModel;
    if (!director)
      throw new Error(`Director with id=${directorId} not found.`);
  }

  await movie.update({
    title: title || movie.title,
    genre: genre || movie.genre,
    release: release || movie.release,
    DirectorId: directorId || movie.DirectorId
  });

  return movie;
};

const deleteMovie: Resolver<String> = async (_, { id }) => {
  const movie = await Movie.findByPk(id) as MovieModel;
  if (!movie)
    throw new Error(`Movie with id=${id} not found.`);

  await movie.destroy();
  return id as string;
};

export default {
  Query: {
    movie: getMovieById,
    moviesByDirectorId: getMoviesByDirectorId
  },
  Mutation: {
    addMovie: mergeResolvers(createMovie, [authRequired, adminRequired]),
    editMovie: mergeResolvers(updateMovie, [authRequired, adminRequired]),
    removeMovie: mergeResolvers(deleteMovie, [authRequired, adminRequired])
  },
  Movie: {
    director: async (movie: MovieModel): Promise<DirectorModel> => {
      return await movie.getDirector();
    },
    reviews: async (movie: MovieModel): Promise<ReviewModel[]> => {
      return await movie.getReviews();
    }
  }
};