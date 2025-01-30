// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        environment: 'happy-dom', // Use jsdom for browser-like tests
        deps: {
            inline: ['vitest-canvas-mock'],
        },
        coverage: {
            reporter: ['text', 'json', 'html'], // Optional: Add coverage reports
        },
        environmentOptions: {
            jsdom: {
                resources: 'usable',
            },
        },
    },
})