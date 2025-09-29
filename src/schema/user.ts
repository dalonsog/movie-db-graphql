import { gql } from 'graphql-tag';

export default gql`
  type User {
    id: ID!
    username: String!
    role: String!
    reviews: [Review]!
  }

  extend type Query {
    user(id: ID!): User!
    users: [User]!
  }
`;