import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const events = {
  review: {
    reviewCreated: 'REVIEW_CREATED'
  }
};

export { pubsub, events };