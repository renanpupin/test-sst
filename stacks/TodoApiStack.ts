import {StackContext, Api, EventBus, Function, Cron} from 'sst/constructs'

export function API({stack}: StackContext) {
    const bus = new EventBus(stack, 'bus', {
        defaults: {
            retries: 10
        }
    })

    const api = new Api(stack, 'api', {
        defaults: {
            function: {
                bind: [bus]
            }
        },
        routes: {
            'GET /': 'packages/functions/src/lambda.handler',
            'GET /todo': 'packages/functions/src/todo.list',
            'POST /todo': 'packages/functions/src/todo.create'
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
        schedule: 'rate(1 minute)',
        job: 'packages/functions/src/lambda.cron'
    })

    stack.addOutputs({
        ApiEndpoint: api.url
    })
}
