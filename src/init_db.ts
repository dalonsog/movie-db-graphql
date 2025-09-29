import { sequelize, Director, Movie, User, Review } from "./models/index.js";
import { DirectorModel, Genre, MovieModel, ReviewModel, Role, UserModel } from "./types.js";

sequelize.sync({ force: true }).then(async () => {
  // Directors
  const paulThomasAnderson = await Director.create({
    fullname: 'Paul Thomas Anderson'    
  }) as DirectorModel;

  const jamesGunn = await Director.create({
    fullname: 'James Gunn'
  }) as DirectorModel;

  // Users
  const admin = await User.create({
    username: process.env.ADMIN_USERNAME as string,
    password: process.env.ADMIN_PASSWORD as string,
    role: Role.ADMIN
  }) as UserModel;
  
  const user1 = await User.create({
    username: 'user1',
    password: 'someSecr3tP4ssw0rd123!',
    role: Role.USER
  }) as UserModel;

  // Movies
  const oneBattleAfterAnother = await Movie.create({
    title: 'One Battle After Another',
    genre: Genre.THRILLER,
    release: 2025,
    DirectorId: paulThomasAnderson.id
  }) as MovieModel;

  await Movie.create({
    title: 'Licorice Pizza',
    genre: Genre.COMEDY,
    release: 2021,
    DirectorId: paulThomasAnderson.id
  }) as MovieModel;
  
  const theSuicideSquad = await Movie.create({
    title: 'The Suicide Squad',
    genre: Genre.ACTION,
    release: 2021,
    DirectorId: jamesGunn.id
  }) as MovieModel;

  // Reviews
  await Review.create({
    title: 'Movie of the year',
    content: 'Very good movie!',
    stars: 4,
    UserId: admin.id,
    MovieId: oneBattleAfterAnother.id
  }) as ReviewModel;
  
  await Review.create({
    title: 'Kinda boring',
    content: `Suicide Squad boasts a talented cast and a little more humor 
      than previous DCEU efforts, but they aren't enough to save the 
      disappointing end result from a muddled plot, thinly written characters, 
      and choppy directing.`,
    stars: 2,
    UserId: user1.id,
    MovieId: theSuicideSquad.id
  }) as ReviewModel;
  
  await Review.create({
    title: 'It\'s OK',
    content: 'A witty, jam-packed and enjoyable film that surpassed the last',
    stars: 3,
    UserId: admin.id,
    MovieId: theSuicideSquad.id
  }) as ReviewModel;

  const directors = await Director.findAll();
  console.log(directors);
  const users = await User.findAll();
  console.log(users);
  const movies = await Movie.findAll();
  console.log(movies);
  const reiews = await Review.findAll();
  console.log(reiews);
});
