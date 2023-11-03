import {SSTConfig} from 'sst'
import {API} from './stacks/TodoApiStack'
import {GraphqlAPI} from './stacks/GraphqlStack'
import {GraphqlGatewayAPI} from './stacks/GraphqlGatewayStack'

export default {
    config(_input) {
        return {
            name: 'test-sst',
            region: 'sa-east-1'
            // stage: _input.stage ?? 'integration',
            // profile: _input.stage === "production"
            //     ? "myapp-production"
            //     : "myapp-dev"
        }
    },
    stacks(app) {
        app.setDefaultFunctionProps({
            // runtime: 'nodejs18.x',
            // timeout: 30,
            // memorySize: 512,
            environment: {EXAMPLE_ENV: process.env.EXAMPLE_ENV as string}
        })

        app.stack(API).stack(GraphqlAPI).stack(GraphqlGatewayAPI)

        //You can set a removal policy to apply to all the resources in the app. This is useful for ephemeral environments that need to clean up all their resources on removal.
        //https://docs.sst.dev/constructs/App#setdefaultremovalpolicy
        //app.setDefaultRemovalPolicy(app.mode === "dev" ? "destroy" : "retain")
    }
} satisfies SSTConfig
