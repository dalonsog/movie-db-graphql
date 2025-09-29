import { Movie } from '../models/index.js';
import { DirectorModel, MovieModel, ReviewModel } from '../types.js';

const getMovieById: (
  _: unknown,
  args: { id: string}
) => Promise<MovieModel> = async (_, { id }) => {
  const movie = await Movie.findByPk(id) as MovieModel;
  return movie;
};

const getMoviesByDirectorId: (
  parent: unknown,
  args: { directorId: string}
) => Promise<MovieModel[]> = async (_, { directorId }) => {
  const movies = await Movie.findAll({ 
    where: { DirectorId: directorId }
  }) as MovieModel[];
  return movies;
};

export default {
  Query: {
    movie: getMovieById,
    moviesByDirectorId: getMoviesByDirectorId
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