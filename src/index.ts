import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import {
  ApolloServerPluginDrainHttpServer
} from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/use/ws';
import { WebSocketServer } from 'ws';
import typeDefs from './schema/index.js';
import resolvers from './resolvers/index.js';
import { getAuthUser } from './utils/index.js';
import { ContextValue } from './types.js';
import { userLoader, movieLoader, directorLoader } from './loaders/index.js';

const GRAPHQL_PATH = process.env.GRAPHQL_PATH as string;
const PORT = parseInt(process.env.SERVER_PORT as string);

const app = express();
const httpServer = createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: GRAPHQL_PATH
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer<ContextValue>({
  schema,
  includeStacktraceInErrorResponses: false,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        }
      }
    }
  ]
});

await server.start();

app.use(cors<cors.CorsRequest>());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));
app.use(express.json());
app.use(
  GRAPHQL_PATH,
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization || '';
      const token = auth.split(' ')[1];
      const user = getAuthUser(token);
      return { 
        authUser: user,
        loaders: {
          user: userLoader,
          movie: movieLoader,
          director: directorLoader
        }
      };
    }
  })
);

httpServer.listen(PORT, () => {
  console.log(`Apollo Server on http://localhost:${PORT}${GRAPHQL_PATH}`);
});