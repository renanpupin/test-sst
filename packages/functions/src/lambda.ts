import AWS from 'aws-sdk'
import {SNSEvent, SQSEvent} from 'aws-lambda'
import {ApiHandler} from 'sst/node/api'
import {Topic} from 'sst/node/topic'
import {Queue} from 'sst/node/queue'

const sns = new AWS.SNS()
const sqs = new AWS.SQS()

export const handler = ApiHandler(async _evt => {
    return {
        statusCode: 200,
        body: `Hello world. The time is ${new Date().toISOString()}`
    }
})

export const cron = ApiHandler(async _evt => {
    console.log('executing cron...')
    return {
        statusCode: 200,
        body: `Cron executed.`
    }
})

export const snsPublish = ApiHandler(async _evt => {
    await sns
        .publish({
            // Get the topic from the environment variable
            TopicArn: Topic.Ping.topicArn,
            Message: JSON.stringify({message: 'ping'}),
            MessageStructure: 'string'
        })
        .promise()

    console.log('sending message to SNS!')

    return {
        statusCode: 200,
        body: `Publish SNS`
    }
})

export const snsConsumer = (event: SNSEvent) => {
    const records: any[] = event.Records
    console.log(`SNS message received: "${records[0].Sns.Message}"`)

    return {
        statusCode: 200,
        body: `Consumer SNS`
    }
}

export const queue = ApiHandler(async _evt => {
    // Send a message to queue
    await sqs
        .sendMessage({
            // Get the queue url from the environment variable
            QueueUrl: Queue.TestQueue.queueUrl,
            MessageBody: JSON.stringify({message: 'sqs works!'})
        })
        .promise()

    console.log('Message queued!')

    return {
        statusCode: 200,
        body: `Add to SQS`
    }
})

export const sqsConsumer = (event: SQSEvent) => {
    const records: any[] = event.Records
    console.log(`Message processed: "${records[0].body}"`)

    return {
        statusCode: 200,
        body: `Consumer SQS`
    }
}
