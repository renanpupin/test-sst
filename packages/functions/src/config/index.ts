import {Config} from 'sst/node/config'

export const getConfig = () => {
    return Config
}

export const getExampleEnv = () => {
    return process.env.EXAMPLE_ENV
}
