import DataLoader from "dataloader";
import Sequelize from "sequelize";
import { Movie } from "../models/index.js";
import { MovieModel } from "../types.js";

const batchMovies = async (ids: string[]) => {
  const movies = await Movie.findAll({
    where: { id: { [Sequelize.Op.in]: ids } }
  }) as MovieModel[];

  return ids.map(id => movies.find((movie) => movie.id === id));
};

export const movieLoader = new DataLoader(
  ids => batchMovies(ids as string[])
) as DataLoader<string, MovieModel>;