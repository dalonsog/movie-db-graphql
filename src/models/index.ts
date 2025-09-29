import { Sequelize } from "sequelize";
import movieSchema from "./movie.js";
import directorSchema from "./director.js";
import userSchema from "./user.js";
import reviewSchema from "./review.js";
import { hashPassword } from "../utils/security.js";
import { UserModel } from '../types.js';

const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;
const username = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const table = process.env.POSTGRES_DB;

const DB_URL = `postgres://${username}:${password}@${host}:${port}/${table}`;

const sequelize = new Sequelize(DB_URL);

const Movie = sequelize.define(...movieSchema);
const Director = sequelize.define(...directorSchema);
const User = sequelize.define(...userSchema);
const Review = sequelize.define(...reviewSchema);

User.beforeCreate(async (user) => {
  const hashedPassword = await hashPassword((user as UserModel).password);
  (user as UserModel).password = hashedPassword;
});

Director.hasMany(Movie, { onDelete: 'CASCADE' });
User.hasMany(Review, { onDelete: 'CASCADE' });
Movie.belongsTo(Director);
Movie.hasMany(Review, { onDelete: 'CASCADE' });
Review.belongsTo(User);
Review.belongsTo(Movie);

export {
  sequelize,
  Movie,
  Director,
  User,
  Review
};