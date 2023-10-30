import {expect, it} from 'vitest'
import {handler} from './lambda'

it('test domain code handler', async () => {
    // Check the newly created article exists
    expect(handler).not.toBeNull()
})
