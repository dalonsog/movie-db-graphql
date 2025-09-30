import { Movie, Review } from '../models/index.js';
import { MovieModel, Resolver, ReviewModel, UserModel } from '../types.js';
import { authRequired, mergeResolvers } from '../utils/resolver.js';

const getReviewById: Resolver<ReviewModel> = async (_, { id }) => {
  const review = await Review.findByPk(id) as ReviewModel;
  return review;
};

const getReviewsByMovieId: Resolver<ReviewModel[]> = async (_, { movieId }) => {
  const reviews = await Review.findAll({ 
    where: { MovieId: movieId }
  }) as ReviewModel[];
  return reviews;
};

const getReviewsByUserId: Resolver<ReviewModel[]> = async (_, { userId }) => {
  const reviews = await Review.findAll({ 
    where: { UserId: userId }
  }) as ReviewModel[];
  return reviews;
};

const createReview: Resolver<ReviewModel> = async (
  _,
  { movieId, title, content, stars},
  { authUser }
) => {
  const movie = await Movie.findByPk(movieId);
  if (!movie) throw new Error(`Movie with id=${movieId} not found.`);

  return await Review.create({
    title,
    content,
    stars,
    MovieId: movieId,
    UserId: authUser?.id
  }) as ReviewModel;
};

export default {
  Query: {
    review: getReviewById,
    reviewsByMovieId: getReviewsByMovieId,
    reviewsByUserId: getReviewsByUserId
  },
  Mutation: {
    postReview: mergeResolvers(createReview, [authRequired])
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