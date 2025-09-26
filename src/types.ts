import { ModelAttributes, ModelOptions, Model } from "sequelize";

export type ModelSchema = [string, ModelAttributes, ModelOptions];

export enum Genre {
  ADVENTURE = 'adventure',
  THRILLER = 'thriller',
  ACTION = 'action',
  ROMANCE = 'romance',
  COMEDY = 'comedy'
};

export enum Role {
  ADMIN = 'admin',
  USER = 'user'
};

export interface IUser {
  id: string
  username: string
  password: string
  role: string
};

export interface IReview {
  id: string
  title: string
  content: string
  stars: number
};

export interface IMovie {
  id: string
  title: string
  genre: Genre
  release: number
};

export interface IDirector {
  id: string
  name: string
  lastname: string
};

export interface DBUser extends IUser, Model {
  id: string
  username: string
  password: string
};