import Sequelize from 'sequelize';
import { DBModel, PaginatedResponse, CursorOptions } from "../types.js";

export const toCursorHash: (
  string: string
) => string = string => Buffer.from(string).toString('base64');

export const fromCursorHash: (
  string: string
) => string = string => Buffer.from(string, 'base64').toString('ascii');

export const getCursorOptions: (
  cursor: string
) => CursorOptions = (cursor) => {
  return cursor
    ? {
        createdAt: {
          [Sequelize.Op.lt]: new Date(parseInt(fromCursorHash(cursor)))
        }
      }
    : {};
};

export const getPaginatedResponse: <T extends DBModel>(
  elements: T[],
  limit: number
) => PaginatedResponse<T> = (elements, limit) => {
  const hasNextPage = elements.length > (limit as number);
  const edges = hasNextPage ? elements.slice(0, -1) : elements;

  return {
    edges,
    pageInfo: {
      hasNextPage,
      endCursor: toCursorHash(
        edges[edges.length - 1].createdAt.getTime().toString(),
      ),
    },
  };
};