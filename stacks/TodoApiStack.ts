import {StackContext, Api, EventBus, Function, Cron, Topic, Queue, Config} from 'sst/constructs'

export function API({stack}: StackContext) {
    const bus = new EventBus(stack, 'bus', {
        defaults: {
            retries: 10
        }
    })

    const pingTopic = new Topic(stack, 'Ping', {
        subscribers: {
            ping: 'packages/functions/src/lambda.snsConsumer'
        }
    })

    const queue = new Queue(stack, 'TestQueue', {
        consumer: 'packages/functions/src/lambda.sqsConsumer'
    })

    const ssmSecret = new Config.Secret(stack, 'EXAMPLE_SSM')

    const api = new Api(stack, 'api', {
        defaults: {
            function: {
                bind: [bus, pingTopic, queue, ssmSecret]
            }
        },
        routes: {
            'GET /': 'packages/functions/src/lambda.handler',
            'GET /todo': 'packages/functions/src/todo.list',
            'POST /todo': 'packages/functions/src/todo.create',
            'GET /sns': 'packages/functions/src/lambda.snsPublish',
            'GET /queue': 'packages/functions/src/lambda.queue'
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
        schedule: 'rate(5 minutes)',
        job: 'packages/functions/src/lambda.cron'
    })

    stack.addOutputs({
        ApiEndpoint: api.url
    })
}
