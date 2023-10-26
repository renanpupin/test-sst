import {ApolloServer} from '@apollo/server'
import {startServerAndCreateLambdaHandler, handlers} from '@as-integrations/aws-lambda'
import {ApiHandler} from 'sst/node/api'
import {db} from 'src/db'

//TODO: move to code first with federation support
const typeDefs = `#graphql
type Query {
    hello: String
    prisma: String
}
`

const resolvers = {
    Query: {
        hello: () => 'world',
        prisma: async () => {
            // await db.user.create({
            //     data: {
            //         id: 1,
            //         name: 'Test user',
            //         email: 'test@test.com'
            //     }
            // })
            const result = await db.user.findMany()

            console.log('JSON.stringify(result)', JSON.stringify(result))

            return `prisma ${JSON.stringify(result)}`
        }
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
