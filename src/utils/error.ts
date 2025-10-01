import { GraphQLError } from 'graphql';

export class AuthenticationError extends GraphQLError {
  public constructor(message: string) {
    super(message)
    this.extensions.code = 'AUTHENTICATION_ERROR'
  }
};

export class AuthorizationError extends GraphQLError {
  public constructor(message: string) {
    super(message)
    this.extensions.code = 'AUTHORIZATION_ERROR'
  }
};

export class NotFoundError extends GraphQLError {
  public constructor(message: string) {
    super(message)
    this.extensions.code = 'NOT_FOUND_ERROR'
  }
};

export class InvalidInputError extends GraphQLError {
  public constructor(message: string) {
    super(message)
    this.extensions.code = 'INVALID_INPUT_ERROR'
  }
};