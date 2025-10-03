import DataLoader from "dataloader";
import Sequelize from "sequelize";
import { User } from "../models/index.js";
import { UserModel } from "../types.js";

const batchUsers = async (ids: string[]) => {
  const users = await User.findAll({
    where: { id: { [Sequelize.Op.in]: ids } }
  }) as UserModel[];

  return ids.map(id => users.find((user) => user.id === id));
};

export const userLoader = new DataLoader(
  ids => batchUsers(ids as string[])
) as DataLoader<string, UserModel>;