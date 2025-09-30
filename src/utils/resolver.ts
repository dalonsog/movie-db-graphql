import { Resolver, ResolverDependency, Role } from '../types.js';

export const authRequired: ResolverDependency = (_, __, { authUser }) => {
  if (!authUser) throw new Error("Invalid token");
};

export const adminRequired: ResolverDependency = (_, __, { authUser }) => {
  if (authUser?.role !== Role.ADMIN) throw new Error("Not enough privileges");
};

export const mergeResolvers: <T>(
  resolver: Resolver<T>,
  deps: ResolverDependency[]
) => Resolver<T> = (resolver, deps) => {
  const fn: typeof resolver = async (parent, args, context) => {
    for (let dep of deps) {
      dep(parent, args, context);
    }
    return await resolver(parent, args, context);
  }
  return fn;
};