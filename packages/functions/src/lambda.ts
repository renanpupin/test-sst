import {ApiHandler} from 'sst/node/api'

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
