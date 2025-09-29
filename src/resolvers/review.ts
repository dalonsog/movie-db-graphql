import { Review } from '../models/index.js';
import { MovieModel, ReviewModel, UserModel } from '../types.js';

const getReviewById: (
  _: unknown,
  args: { id: string}
) => Promise<ReviewModel> = async (_, { id }) => {
  const review = await Review.findByPk(id) as ReviewModel;
  return review;
};

const getReviewsByMovieId: (
  parent: unknown,
  args: { movieId: string}
) => Promise<ReviewModel[]> = async (_, { movieId }) => {
  const reviews = await Review.findAll({ 
    where: { MovieId: movieId }
  }) as ReviewModel[];
  return reviews;
};

const getReviewsByUserId: (
  parent: unknown,
  args: { userId: string}
) => Promise<ReviewModel[]> = async (_, { userId }) => {
  const reviews = await Review.findAll({ 
    where: { UserId: userId }
  }) as ReviewModel[];
  return reviews;
};

export default {
  Query: {
    review: getReviewById,
    reviewsByMovieId: getReviewsByMovieId,
    reviewsByUserId: getReviewsByUserId
  },
  Review: {
    user: async (review: ReviewModel): Promise<UserModel> => {
      return await review.getUser();
    },
    movie: async (review: ReviewModel): Promise<MovieModel> => {
      return await review.getMovie();
    }
  }
};