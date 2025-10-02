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

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type ReviewResponse {
    edges: [Review!]!
    pageInfo: PageInfo!
  }

  extend type Query {
    review(id: ID!): Review!
    reviewsByMovieId(movieId: ID!, cursor: String, limit: Int): ReviewResponse!
    reviewsByUserId(userId: ID!, cursor: String, limit: Int): ReviewResponse!
  }

  extend type Mutation {
    postReview(movieId: ID!, title: String!, content: String!, stars: Int!): Review!
    editReview(id: ID!, title: String, content: String, stars: Int): Review!
    removeReview(id: ID!): ID!
  }
`;