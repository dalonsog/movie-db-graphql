import { Movie } from '../models/index.js';
import { DirectorModel, MovieModel, Resolver, ReviewModel } from '../types.js';

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