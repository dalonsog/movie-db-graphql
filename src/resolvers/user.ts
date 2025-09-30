import { User } from '../models/index.js';
import { ReviewModel, UserModel, Token, Resolver, Role } from '../types.js';
import { generateToken, verifyPassword } from '../utils/security.js';
import { authRequired, mergeResolvers } from '../utils/resolver.js';

const getUserById: Resolver<UserModel> = async (_, { id }) => {
  return await User.findByPk(id) as UserModel;
};

const getCurrentUser: Resolver<UserModel> = async (_, __, { authUser }) => {
  return await User.findByPk(authUser?.id) as UserModel;
};

const getUsers = async (): Promise<UserModel[]> => {
  const users = await User.findAll() as UserModel[];
  return users;
};

const login: (
  _: unknown,
  args: { username: string, password: string }
) => Promise<Token> = async (_, { username, password }) => {
  const user = await User.findOne({ where: { username } }) as UserModel;
  if (!user) throw new Error("Invalid username/password combination")

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) throw new Error("Invalid username/password combination")
  
  return generateToken(user);
};

const createUser: Resolver<Token> = async (_, { username, password }) => {
  const user = await User.findOne({ where: { username } });
  if (user) throw new Error(`User ${username} already exists.`);
  
  const newUser = await User.create({ username, password, role: Role.USER });
  return generateToken(newUser as UserModel);
};

export default {
  Query: {
    me: mergeResolvers(getCurrentUser, [authRequired]),
    user: getUserById,
    users: getUsers
  },
  Mutation: {
    logIn: login,
    signUp: createUser
  },
  User: {
    reviews: async (user: UserModel): Promise<ReviewModel[]> => {
      return await user.getReviews();
    }
  }
};