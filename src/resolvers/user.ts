import { User } from '../models/index.js';
import { ReviewModel, UserModel } from '../types.js';

const getUserById: (
  _: unknown,
  args: { id: string }
) => Promise<UserModel> = async (_, { id }) => {
  const user = await User.findByPk(id) as UserModel;
  return user;
};

const getUsers = async (): Promise<UserModel[]> => {
  const users = await User.findAll() as UserModel[];
  return users;
};

export default {
  Query: {
    user: getUserById,
    users: getUsers
  },
  User: {
    reviews: async (user: UserModel): Promise<ReviewModel[]> => {
      return await user.getReviews();
    }
  }
};