import { User, Movie, Review } from '../models/index.js';
import {
  authRequired,
  mergeResolvers,
  ownerRequired,
  NotFoundError,
  getCursorOptions,
  getPaginatedResponse
} from '../utils/index.js';
import { pubsub, events } from '../subscriptions/index.js';
import {
  ContextValue,
  MovieModel,
  PaginatedResponse,
  Resolver,
  ReviewModel,
  UserModel
} from '../types.js';

const getReviewById: Resolver<ReviewModel> = async (_, { id }) => {
  const review = await Review.findByPk(id) as ReviewModel;
  return review;
};

const getReviewsByMovieId: Resolver<PaginatedResponse<ReviewModel>> = async (
  _,
  { movieId, cursor, limit = 100 }
) => {
  const cursorOptions = getCursorOptions(cursor as string);

  const reviews = await Review.findAll({
    order: [['createdAt', 'DESC']],
    limit: (limit as number) + 1, 
    where: { 
      MovieId: movieId,
      ...cursorOptions
    }
  }) as ReviewModel[];

  return getPaginatedResponse(reviews, limit as number);
};

const getReviewsByUserId: Resolver<PaginatedResponse<ReviewModel>> = async (
  _,
  { userId, cursor, limit = 100 }
) => {
  const cursorOptions = getCursorOptions(cursor as string);
  
  const reviews = await Review.findAll({ 
    order: [['createdAt', 'DESC']],
    limit: (limit as number) + 1, 
    where: {
      UserId: userId,
      ...cursorOptions
    }
  }) as ReviewModel[];

  return getPaginatedResponse(reviews, limit as number);
};

const createReview: Resolver<ReviewModel> = async (
  _,
  { movieId, title, content, stars},
  { authUser }
) => {
  const movie = await Movie.findByPk(movieId);
  if (!movie) throw new NotFoundError(`Movie with id=${movieId} not found`);

  const newReview = await Review.create({
    title,
    content,
    stars,
    MovieId: movieId,
    UserId: authUser?.id
  }) as ReviewModel;

  pubsub.publish(events.review.reviewCreated, { reviewCreated: newReview});

  return newReview;
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
  Subscription: {
    reviewCreated: {
      subscribe: () => pubsub.asyncIterableIterator(events.review.reviewCreated)
    }
  },
  Review: {
    user: async (
      review: ReviewModel,
      _: unknown,
      context: ContextValue
    ): Promise<UserModel> => {
      if (context)
        return await context.loaders.user.load(review.UserId) as UserModel;
      else
        return await User.findByPk(review.UserId) as UserModel;
    },
    movie: async (
      review: ReviewModel,
      _: unknown,
      context: ContextValue
    ): Promise<MovieModel> => {
      if (context)
        return await context.loaders.movie.load(review.UserId) as MovieModel;
      else
        return await Movie.findByPk(review.MovieId) as MovieModel;
    }
  }
};