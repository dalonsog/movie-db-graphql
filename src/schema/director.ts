import { gql } from 'graphql-tag';

export default gql`
  type Director {
    id: ID!
    fullname: String!
    movies: [Movie!]!
  }

  extend type Query {
    director(id: ID!): Director!
    directors: [Director]!
  }

  extend type Mutation {
    addDirector(fullname: String!): Director!
    editDirector(id: ID!, fullname: String!): Director!
    removeDirector(id: ID!): ID!
  }
`;