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
  username: string;
  role: Role;
};

export interface IReview {
  title: string;
  content: string;
  stars: number;
};

export interface IMovie {
  title: string;
  genre: Genre;
  release: number;
};

export interface IDirector {
  fullname: string;
};

export interface UserModel extends IUser, Model {
  id: string;
  password: string;
  getReviews: () => Promise<ReviewModel[]>;
};

export interface DirectorModel extends IDirector, Model {
  id: string;
  getMovies: () => Promise<MovieModel[]>;
};

export interface MovieModel extends IMovie, Model {
  id: string;
  getDirector: () => Promise<DirectorModel>;
  getReviews: () => Promise<ReviewModel[]>;
};

export interface ReviewModel extends IReview, Model {
  id: string;
  movieId: string;
  userId: string;
  getUser: () => Promise<UserModel>;
  getMovie: () => Promise<MovieModel>;
};