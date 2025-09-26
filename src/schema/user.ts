import { gql } from 'graphql-tag';

export default gql`
  type User {
    id: ID!
    username: String!
    password: String!
    reviews: [Review]!
  }

  extend type Query {
    users: [User]
  }
`;