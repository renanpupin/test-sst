import {StackContext, Api, use} from 'sst/constructs'
import {GraphqlAPI} from './GraphqlStack'

export async function GraphqlGatewayAPI({stack, app}: StackContext) {
    const gqlStackInfo = use(GraphqlAPI)

    const api = new Api(stack, 'gql-gateway-api', {
        defaults: {
            function: {
                // runtime: 'nodejs18.x',
                timeout: 15,
                environment: {
                    GQL_API_URL: `${gqlStackInfo.api.url}/graphql`
                }
            }
        },
        routes: {
            'GET /': 'packages/functions/src/graphqlGateway.handler',
            'GET /graphql': {
                type: 'graphql',
                function: 'packages/functions/src/graphqlGateway.gqlHandler'
            },
            'POST /graphql': {
                type: 'graphql',
                function: 'packages/functions/src/graphqlGateway.gqlHandler'
            }
        }
    })

    stack.addOutputs({
        ApiEndpoint: api.url,
        GqlGatewayEndpoint: `${api.url}/graphql`
    })
}
