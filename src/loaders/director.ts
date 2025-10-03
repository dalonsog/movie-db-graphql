import DataLoader from "dataloader";
import Sequelize from "sequelize";
import { Director } from "../models/index.js";
import { DirectorModel } from "../types.js";

const batchDirectors = async (ids: string[]) => {
  const directors = await Director.findAll({
    where: { id: { [Sequelize.Op.in]: ids } }
  }) as DirectorModel[];

  return ids.map(id => directors.find((director) => director.id === id));
};

export const directorLoader = new DataLoader(
  ids => batchDirectors(ids as string[])
) as DataLoader<string, DirectorModel>;