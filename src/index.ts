import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schema/index.js';
import resolvers from './resolvers/index.js';
import { getAuthUser } from './utils/security.js';
import { ContextValue } from './types.js';

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
  /*formatError: (formattedError, error) => {
    console.log(formattedError);
    console.log(error);
    return formattedError;
  },*/
  includeStacktraceInErrorResponses: false
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers.authorization || '';
    const token = auth.split(' ')[1];
    const user = getAuthUser(token);
    return { authUser: user };    
  }
});

console.log(`Server listening at: ${url}`);
