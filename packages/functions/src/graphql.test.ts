import {expect, it} from 'vitest'
import fetch from 'node-fetch'

import {Api} from 'sst/node/api'

it('test graphql handler', async () => {
    console.log('Api.api.url', Api.api.url)
    const response = await fetch(`${Api.api.url}/graphql`, {
        method: 'POST',
        body: JSON.stringify({
            query: 'query Hello {\n' + '  hello\n' + '}'
        })
    })
    const responseData = await response.json()
    console.log('responseData', responseData)

    expect(response).not.toBeNull()
})
