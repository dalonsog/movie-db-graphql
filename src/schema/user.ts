import { gql } from 'graphql-tag';

export default gql`
  type User {
    id: ID!
    username: String!
    role: String!
    reviews: [Review]!
  }

  type Token {
    token: String!
  }

  extend type Query {
    me: User!
    user(id: ID!): User!
    users: [User]!
  }

  extend type Mutation {
    logIn(username: String!, password: String!): Token!
    signUp(username: String!, password: String!): Token!
  }
`;