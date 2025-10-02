import { NotFoundError, InvalidInputError } from '../utils/index.js';
import { Director } from '../models/index.js';
import { DirectorModel, MovieModel, Resolver } from '../types.js';
import {
  adminRequired,
  authRequired,
  mergeResolvers
} from '../utils/index.js';

const getDirectorById: (
  _: unknown,
  args: { id: string}
) => Promise<DirectorModel> = async (_, { id }) => {
  const director = await Director.findByPk(id) as DirectorModel;
  if (!director)
    throw new NotFoundError(`Director id ${id} not found.`);
  return director;
};

const getDirectors: () => Promise<DirectorModel[]> = async () => {
  const directors = await Director.findAll() as DirectorModel[];
  return directors;
};

const createDirector: Resolver<DirectorModel> = async (_, { fullname }) => {
  const director = await Director.findOne({
    where: { fullname }
  }) as DirectorModel;
  if (director)
    throw new InvalidInputError(`Director ${fullname} already exists.`);
  
  return await Director.create({ fullname }) as DirectorModel;
};

const updateDirector: Resolver<DirectorModel> = async (_, { id, fullname }) => {
  const director = await Director.findByPk(id) as DirectorModel;
  if (!director)
    throw new NotFoundError(`Director with id=${fullname} not found.`);

  await director.update({ fullname });
  
  return director;
};

const deleteDirector: Resolver<String> = async (_, { id }) => {
  const director = await Director.findByPk(id) as DirectorModel;
  if (!director)
    throw new NotFoundError(`Director id ${id} not found.`);
  await director.destroy();
  return id as string;
};

export default {
  Query: {
    director: getDirectorById,
    directors: getDirectors
  },
  Mutation: {
    addDirector: mergeResolvers(
      createDirector,
      [authRequired, adminRequired]
    ),
    editDirector: mergeResolvers(
      updateDirector,
      [authRequired, adminRequired]
    ),
    removeDirector: mergeResolvers(
      deleteDirector,
      [authRequired, adminRequired]
    ),
  },
  Director: {
    movies: async (director: DirectorModel): Promise<MovieModel[]> => {
      return await director.getMovies();
    }
  }
};