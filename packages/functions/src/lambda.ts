import AWS from 'aws-sdk'
import {ApiHandler} from 'sst/node/api'
import {Topic} from 'sst/node/topic'
import {SNSEvent} from 'aws-lambda'

const sns = new AWS.SNS()

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

export const ping = ApiHandler(async _evt => {
    await sns
        .publish({
            // Get the topic from the environment variable
            TopicArn: Topic.Ping.topicArn,
            Message: JSON.stringify({message: 'ping'}),
            MessageStructure: 'string'
        })
        .promise()

    console.log('sending ping to SNS!')

    return {
        statusCode: 200,
        body: `Ping SNS`
    }
})

export const pong = (event: SNSEvent) => {
    const records: any[] = event.Records
    console.log(`Pong received: "${records[0].Sns.Message}"`)

    return {
        statusCode: 200,
        body: `Pong SNS`
    }
}
