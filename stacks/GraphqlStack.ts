import {StackContext, Api, EventBus, Function} from "sst/constructs";

export function GraphqlAPI({stack}: StackContext) {
    const api = new Api(stack, "gql-api", {
        routes: {
            "GET /": "packages/functions/src/graphql.handler",
            "GET /graphql": {
                type: "graphql",
                function: "packages/functions/src/graphql.gqlHandler",
            },
            "POST /graphql": {
                type: "graphql",
                function: "packages/functions/src/graphql.gqlHandler",
            }
        },
    });

    stack.addOutputs({
        ApiEndpoint: api.url,
    });
}
