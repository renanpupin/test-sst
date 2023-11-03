import {ApolloServer} from '@apollo/server'
import {startServerAndCreateLambdaHandler, handlers} from '@as-integrations/aws-lambda'
import {ApiHandler} from 'sst/node/api'
import {ApolloGateway, IntrospectAndCompose} from '@apollo/gateway'

const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [{name: 'legacy', url: process.env.GQL_API_URL}]
    })
})

const server = new ApolloServer({gateway})

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
        body: `Hello from gql gateway api.`
    }
})
