import fs from 'fs-extra'
import path from 'node:path'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import {StackContext, Api} from 'sst/constructs'

function preparePrismaLayerFiles() {
    const layerPath = './layers/prisma'
    fs.rmSync(layerPath, {force: true, recursive: true})
    fs.mkdirSync(layerPath, {recursive: true})
    const files = [
        'node_modules/.prisma',
        'node_modules/@prisma/client',
        'node_modules/prisma/build'
    ]
    for (const file of files) {
        // Do not include binary files that aren't for AWS to save space
        fs.copySync(file, path.join(layerPath, 'nodejs', file), {
            filter: src => !src.endsWith('so.node') || src.includes('rhel')
        })
    }
}

export function GraphqlAPI({stack, app}: StackContext) {
    // if (!app.local) {
    //     // Create a layer for production
    //     // This saves shipping Prisma binaries once per function
    //     const layerPath = '.sst/layers/prisma'
    //
    //     // Clear out the layer path
    //     fs.removeSync(layerPath, {force: true, recursive: true})
    //     fs.mkdirSync(layerPath, {recursive: true})
    //
    //     // Copy files to the layer
    //     const toCopy = [
    //         'node_modules/.prisma',
    //         'node_modules/@prisma/client',
    //         'node_modules/prisma/build'
    //     ]
    //     for (const file of toCopy) {
    //         fs.copySync(file, path.join(layerPath, 'nodejs', file), {
    //             // Do not include binary files that aren't for AWS to save space
    //             filter: src => !src.endsWith('so.node') || src.includes('rhel')
    //         })
    //     }
    //     const prismaLayer = new lambda.LayerVersion(stack, 'PrismaLayer', {
    //         code: lambda.Code.fromAsset(path.resolve(layerPath))
    //     })
    //
    //     // Add to all functions in this stack
    //     stack.addDefaultFunctionLayers([prismaLayer])
    // }
    preparePrismaLayerFiles()
    const PrismaLayer = new lambda.LayerVersion(stack, 'PrismaLayer', {
        description: 'Prisma layer',
        code: lambda.Code.fromAsset('./layers/prisma')
    })

    const api = new Api(stack, 'gql-api', {
        defaults: {
            function: {
                // runtime: 'nodejs18.x',
                timeout: 15,
                environment: {
                    DATABASE_URL: app.local
                        ? 'mysql://root@localhost:3306/test'
                        : 'mysql://production-url'
                },
                nodejs: {
                    esbuild: {
                        external: ['@prisma/client', '.prisma']
                    }
                    // esbuild: {
                    //     // Only reference external modules when deployed
                    //     external: app.local ? [] : ['@prisma/client', '.prisma']
                    // }
                },
                layers: [PrismaLayer]
            }
        },
        routes: {
            'GET /': 'packages/functions/src/graphql.handler',
            'GET /graphql': {
                type: 'graphql',
                function: 'packages/functions/src/graphql.gqlHandler'
            },
            'POST /graphql': {
                type: 'graphql',
                function: 'packages/functions/src/graphql.gqlHandler'
            }
        }
    })

    stack.addOutputs({
        ApiEndpoint: api.url,
        GqlEndpoint: `${api.url}/graphql`
    })

    return {
        api
    }
}
