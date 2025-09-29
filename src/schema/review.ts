import { gql } from 'graphql-tag';

export default gql`
  type Review {
    id: ID!
    title: String!
    content: String!
    stars: Int!
    user: User!
    movie: Movie!
  }

  extend type Query {
    review(id: ID!): Review!
    reviewsByMovieId(movieId: ID!): [Review]!
    reviewsByUserId(userId: ID!): [Review]!
  }
`;