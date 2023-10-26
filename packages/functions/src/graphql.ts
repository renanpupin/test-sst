import {ApolloServer} from '@apollo/server'
import {startServerAndCreateLambdaHandler, handlers} from '@as-integrations/aws-lambda'
import {ApiHandler} from 'sst/node/api'

//TODO: move to code first with federation support
const typeDefs = `#graphql
type Query {
    hello: String
}
`

const resolvers = {
    Query: {
        hello: () => 'world'
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

export const gqlHandler = startServerAndCreateLambdaHandler(
    server,
    handlers.createAPIGatewayProxyEventV2RequestHandler(),
    {
        context: async ({event, context}) => {
            // console.log('event,context', {event, context})
            return {
                lambdaEvent: event,
                lambdaContext: context
            }
        }
    }
)
export const handler = ApiHandler(async _evt => {
    return {
        statusCode: 200,
        body: `Hello from gql api.`
    }
})
