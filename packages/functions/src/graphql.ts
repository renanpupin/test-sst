import {ApolloServer} from '@apollo/server';
import {startServerAndCreateLambdaHandler, handlers} from '@as-integrations/aws-lambda';
import {ApiHandler} from "sst/node/api";

const typeDefs = `#graphql
type Query {
    hello: String
}
`;

const resolvers = {
    Query: {
        hello: () => 'world',
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// This final export is important!
export const gqlHandler = startServerAndCreateLambdaHandler(
    server,
    // We will be using the Proxy V2 handler
    handlers.createAPIGatewayProxyEventV2RequestHandler(), {
        context: async ({event, context}) => {
            // console.log('event,context', {event, context})
            return {
                lambdaEvent: event,
                lambdaContext: context,
            };
        },
    });
export const handler = ApiHandler(async (_evt) => {
    return {
        statusCode: 200,
        body: `Hello from gql api.`,
    };
});
