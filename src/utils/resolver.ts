import { AuthenticationError, AuthorizationError } from './error.js';
import { Review } from '../models/index.js';
import { Resolver, ResolverDependency, ReviewModel, Role } from '../types.js';

export const authRequired: ResolverDependency = (_, __, { authUser }) => {
  if (!authUser)
    throw new AuthenticationError('Invalid token');
};

export const adminRequired: ResolverDependency = (_, __, { authUser }) => {
  if (authUser?.role !== Role.ADMIN)
    throw new AuthorizationError('Not enough privileges');
};

export const ownerRequired: ResolverDependency = async (
  _,
  { id },
  { authUser }
) => {
  const review = await Review.findByPk(id) as ReviewModel;
  if (!review || review.UserId !== authUser?.id)
    throw new AuthorizationError('You must be the owner of this review');
};

export const mergeResolvers: <T>(
  resolver: Resolver<T>,
  deps: ResolverDependency[]
) => Resolver<T> = (resolver, deps) => {
  const fn: typeof resolver = async (parent, args, context) => {
    for (let dep of deps) {
      await dep(parent, args, context);
    }
    return await resolver(parent, args, context);
  }
  return fn;
};