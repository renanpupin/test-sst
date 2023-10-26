import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        reporters: ['default', 'html']
        // setupFiles: ['./testSetup'],
    }
})
