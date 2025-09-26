import { gql } from 'graphql-tag';

export default gql`
  type Review {
    id: ID!
    title: String!
    content: String!
    stars: Int!
    user: User!
  }

  extend type Query {
    reviews: [Review]
  }
`;