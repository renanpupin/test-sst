import {ApolloServer} from '@apollo/server'
import {buildSubgraphSchema} from '@apollo/subgraph'
import {startServerAndCreateLambdaHandler, handlers} from '@as-integrations/aws-lambda'
import gql from 'graphql-tag'
import {ApiHandler} from 'sst/node/api'
import {db} from 'src/db'

const typeDefs = gql`
    extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

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
    schema: buildSubgraphSchema({
        typeDefs,
        resolvers
    })
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
