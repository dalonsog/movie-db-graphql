import { Director } from '../models/index.js';
import { DirectorModel, MovieModel } from '../types.js';

const getDirectorById: (
  _: unknown,
  args: { id: string}
) => Promise<DirectorModel> = async (_, { id }) => {
  const director = await Director.findByPk(id) as DirectorModel;
  return director;
};

const getDirectors = async (): Promise<DirectorModel[]> => {
  const directors = await Director.findAll() as DirectorModel[];
  return directors;
}

export default {
  Query: {
    director: getDirectorById,
    directors: getDirectors
  },
  Director: {
    movies: async (director: DirectorModel): Promise<MovieModel[]> => {
      return await director.getMovies();
    }
  }
};