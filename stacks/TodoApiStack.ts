import {StackContext, Api, EventBus, Function, Cron, Topic} from 'sst/constructs'

export function API({stack}: StackContext) {
    const bus = new EventBus(stack, 'bus', {
        defaults: {
            retries: 10
        }
    })

    const pingTopic = new Topic(stack, 'Ping', {
        subscribers: {
            ping: 'packages/functions/src/lambda.pong'
        }
    })

    const api = new Api(stack, 'api', {
        defaults: {
            function: {
                bind: [bus, pingTopic]
            }
        },
        routes: {
            'GET /': 'packages/functions/src/lambda.handler',
            'GET /todo': 'packages/functions/src/todo.list',
            'POST /todo': 'packages/functions/src/todo.create',
            'GET /ping': 'packages/functions/src/lambda.ping'
        }
    })

    bus.subscribe('todo.created', {
        handler: 'packages/functions/src/events/todo-created.handler'
    })

    new Function(stack, 'Fn', {
        handler: 'packages/functions/src/lambda.handler',
        timeout: 20
    })

    new Cron(stack, 'Cron', {
        schedule: 'rate(2 minutes)',
        job: 'packages/functions/src/lambda.cron'
    })

    stack.addOutputs({
        ApiEndpoint: api.url
    })
}
