import { gql } from 'graphql-tag';

export default gql`
  type Director {
    id: ID!
    name: String!
    lastname: String!
    movies: [Movie!]!
  }

  extend type Query {
    directors: [Director]
  }
`;