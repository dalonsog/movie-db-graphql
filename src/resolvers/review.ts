import { NotFoundError } from '../utils/error.js';
import { Movie, Review } from '../models/index.js';
import { MovieModel, Resolver, ReviewModel, UserModel } from '../types.js';
import { authRequired, mergeResolvers, ownerRequired } from '../utils/resolver.js';

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
  if (!movie) throw new NotFoundError(`Movie with id=${movieId} not found`);

  return await Review.create({
    title,
    content,
    stars,
    MovieId: movieId,
    UserId: authUser?.id
  }) as ReviewModel;
};

const updateReview: Resolver<ReviewModel> = async (
  _,
  { id, title, content, stars }
) => {
  const review = await Review.findByPk(id) as ReviewModel;
  if (!review) throw new NotFoundError(`Review with id=${id} not found`);

  await review.update({
    title: title || review.title,
    content: content || review.content,
    stars: stars || review.stars
  });
  return review;
};

const deleteReview: Resolver<string> = async (_, { id }) => {
  const review = await Review.findByPk(id) as ReviewModel;
  if (!review) throw new NotFoundError(`Review with id=${id} not found`);
  await review.destroy();
  return id as string;
};

export default {
  Query: {
    review: getReviewById,
    reviewsByMovieId: getReviewsByMovieId,
    reviewsByUserId: getReviewsByUserId
  },
  Mutation: {
    postReview: mergeResolvers(createReview, [authRequired]),
    editReview: mergeResolvers(updateReview, [authRequired, ownerRequired]),
    removeReview: mergeResolvers(deleteReview, [authRequired, ownerRequired])
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