import { Book, Category } from '../types.js';

const books: Book[] = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    category: Category.COSA
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    category: Category.OTRACOSA
  },
];

export default {
  Query: {
    books: (): Book[] => books
  }
};