// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        environment: 'jsdom',
        server: {
            deps: {
                inline: ['vitest-canvas-mock'],
            },
        },
        environmentOptions: {
            jsdom: {
                resources: 'usable',
            },
        },
    },
})