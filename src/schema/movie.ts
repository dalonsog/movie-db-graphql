import { gql } from 'graphql-tag';

export default gql`
  type Movie {
    id: ID!
    title: String!
    director: Director!
    genre: String!
    release: Int!
    reviews: [Review!]
  }

  extend type Query {
    movie(id: ID!): Movie!
    moviesByDirectorId(directorId: ID!): [Movie]!
  }
`;